import 'reflect-metadata';
import { Container } from 'typedi';

import { Server } from './server';
import { Database } from './database';

async function startServer(): Promise<void> {
  const db = Container.get(Database);
  await db.create();

  const server = Container.get(Server);
  server.start();
}

startServer();
