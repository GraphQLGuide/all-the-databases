import { User, Views, FortuneCookie, redis } from './connectors';

const l = (...args) => console.log(...args);

const resolvers = {
  Query: {
    user(_, args) {
      return User.find({
        where: { id: args.id }
      });
    },
    follower_feed() {
      return [];
    },
    public_feed() {
      // was getting an error when trying to use the same client created in connectors.js:
      // AbortError: LRANGE can't be processed. The connection is already closed.
      const client = redis.createClient();

      return client
        .lrangeAsync('public_feed', 0, -1)
        .then((values) => {
          l('WHAT', values.map(JSON.parse));
          return values.map(JSON.parse);
        });
    },
    city_feed() {
      return [];
    }
  },
  User: {
    mentions(user) {
      return user.mentions;
    },
    tweets(user) {
      return user.getTweets();
    },
    fortune(user) {
      return FortuneCookie.getOne();
    }
  },
  Tweet: {
    author(tweet) {
      // in Redis, author is a subdoc
      if (tweet.author.firstName) {
        return tweet.author;
      } else {
        return tweet.getAuthor();
      }
    },
    views(tweet) {
      return Views.
        findOne({ tweetId: tweet.id })
        .then((doc) => doc.views);
    }
  }
};

export default resolvers;
