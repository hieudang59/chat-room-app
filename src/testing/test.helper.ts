import supertest from 'supertest';
import Container from 'typedi';
import { Repository } from 'typeorm';

import { Server } from '../server';

const repositories = new Map<Class<unknown>, Repository<object>>();

declare type Class<T> = {
  new (...args: any[]): T;
};

class TestHelper {
  static getRepository = (): Repository<object> => {
    const getRepository: any = {
      createQueryBuilder: () => getRepository,
      leftJoinAndSelect: () => getRepository,
      where: () => getRepository,
      take: () => getRepository,
      skip: () => getRepository,
      getOne: jest.fn(),
      getMany: jest.fn(),
    };

    return getRepository as Repository<object>;
  };

  static mockRepository<T>(entity: Class<T>): any {
    if (repositories.has(entity)) {
      return repositories.get(entity) as Repository<object>;
    }

    const mockRepository = {
      save: jest.fn(),
      count: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      getRepository: TestHelper.getRepository,
    } as unknown as Repository<object>;

    repositories.set(entity, mockRepository);

    return mockRepository;
  }

  static request: any = supertest(Container.get(Server).appInstance);

  static async callApi(query: string, token?: string): Promise<any> {
    return await this.request
      .post('/graphql')
      .send({
        query,
      })
      .set('Accept', 'application/json')
      .set('authorization', `${token ? `Bearer ${token}` : ''}`);
  }
}

export default TestHelper;
