import config from 'config';
import express from 'express';
import { Container, Service } from 'typedi';
import { buildSchema } from 'type-graphql';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import { decode, JwtPayload } from 'jsonwebtoken';
import { GraphQLSchema } from 'graphql/type';

import { authChecker } from '@authentication/authentication.helper';
// Resolvers
import { UserResolver } from '@user/user.resolver';
import { RoomResolver } from '@room/room.resolver';
import { AuthenticationResolver } from '@authentication/authentication.resolver';
import { PostResolver } from '@post/post.resolver';

const port = config.get('SERVER_PORT') || 3030;

@Service()
class Server {
  private app: express.Application;
  private server: ApolloServer;

  constructor() {
    this.app = express();
    this.initializeServer();
  }

  private async initializeServer(): Promise<void> {
    await this.buildServer();
    this.applyMiddleware();
  }

  get appInstance(): express.Application {
    return this.app;
  }

  start(): http.Server {
    return this.app.listen(port, () => {
      console.log(
        `🚀🚀🚀🚀🚀 Server is running on http://localhost:${port}/graphql 🚀🚀🚀🚀🚀`,
      );
    });
  }

  private async getSchema(): Promise<GraphQLSchema> {
    const schema = await buildSchema({
      resolvers: [
        AuthenticationResolver,
        UserResolver,
        RoomResolver,
        PostResolver,
      ],
      container: Container,
      emitSchemaFile: true,
      authChecker: authChecker,
    });

    return schema;
  }

  private applyMiddleware(): void {
    this.server.applyMiddleware({ app: this.app });
  }

  private async buildServer(): Promise<void> {
    this.server = new ApolloServer({
      schema: await this.getSchema(),
      context: ({ req, res }) => {
        const authorization = req.headers['authorization'];
        const token = authorization?.split(' ')[1] || '';
        const decoded = decode(token) as JwtPayload;
        let userId: number | null = null;

        if (decoded) {
          userId = decoded.userId;
        }

        return {
          req,
          res,
          userId,
        };
      },
    });
  }
}

export { Server };
