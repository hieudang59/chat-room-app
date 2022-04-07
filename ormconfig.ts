import * as Connection from 'typeorm';
import config from 'config';

const dir = config.get('dbConfig.DIR');

const ormConfig: Connection.ConnectionOptions = {
  type: 'postgres',
  host: config.get('dbConfig.DB_HOST'),
  port: config.get('dbConfig.DB_PORT'),
  username: config.get('dbConfig.DB_USER'),
  password: config.get('dbConfig.DB_PASSWORD'),
  database: config.get('dbConfig.DB_NAME'),
  synchronize: true,
  logging: false,
  entities: [`${dir}/**/*.entity.{ts,js}`]
};

export default ormConfig;
