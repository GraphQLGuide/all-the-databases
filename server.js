import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';

import schema from './data/schema';
import resolvers from './data/resolvers';

const graphQLServer = express();

const executableSchema = makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
});

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress((req) => {
  let ip = req.ip;
  const inDevelopment = ip === '::1';

  if (inDevelopment) {
    ip = '8.8.8.8';
  }

  return {
    schema: executableSchema,
    context: { ip },
  };
}));

graphQLServer.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const GRAPHQL_PORT = 8080;

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));
