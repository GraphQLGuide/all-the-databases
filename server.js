import express from 'express';
import { apolloServer } from 'graphql-tools';
import Schema from './data/schema';
import Resolvers from './data/resolvers';
// import Mocks from './data/mocks';

const GRAPHQL_PORT = 8080;

const graphQLServer = express();
graphQLServer.use('/', apolloServer({
  graphiql: true,
  pretty: true,
  schema: Schema,
  resolvers: Resolvers,
  allowUndefinedInResolve: false,
  printErrors: true,
  // mocks: Mocks,
}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
