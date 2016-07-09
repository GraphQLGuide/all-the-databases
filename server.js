import express from 'express';
import { apolloServer } from 'graphql-tools';
import schema from './data/schema';
import resolvers from './data/resolvers';

const graphQLServer = express();

graphQLServer.use('/', apolloServer({
  pretty: true,
  graphiql: true,
  printErrors: true,
  schema,
  resolvers
}));

const GRAPHQL_PORT = 8080;

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
