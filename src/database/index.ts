import { Service } from 'typedi';
import { createConnection, getConnection } from 'typeorm';

@Service()
class Database {
  async create(): Promise<void> {
    try {
      await createConnection();
      console.log('Database successfully initialized');
    } catch (error) {
      console.log(`Database failed to connect ${error}`);
    }
  }

  async close(): Promise<void> {
    try {
      return await getConnection().close();
    } catch (err) {
      console.warn('Connection was not found');
    }
  }

  async clear(): Promise<void> {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  }
}

export { Database };
