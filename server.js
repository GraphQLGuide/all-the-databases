import express from 'express';
import { apolloServer } from 'graphql-tools';
import schema from './data/schema';
import resolvers from './data/resolvers';

const graphQLServer = express();

graphQLServer.use('/', apolloServer((req) => {
  let ip = req.ip;
  const inDevelopment = ip === '::1';

  if (inDevelopment) {
    ip = '8.8.8.8';
  }

  return {
    pretty: true,
    graphiql: true,
    printErrors: true,
    schema,
    resolvers,
    context: { ip },
  };
}));

const GRAPHQL_PORT = 8080;

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
