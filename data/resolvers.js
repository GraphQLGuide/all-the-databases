import rp from 'request-promise';
import { User, Tweet, Views, Elasticsearch, redis } from './connectors';

const resolvers = {
  Query: {
    user(_, args) {
      return null;
    },
    async publicFeed() {
      return [];
    },
    async cityFeed(_, args, context) {
      return [];
    },
  },
  User: {
    async mentions(user) {
      return [];
    },
  },
  Tweet: {
    author(tweet) {
      return null;
    },
    views(tweet) {
      return null;
    },
  },
};

export default resolvers;
