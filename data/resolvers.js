import { User, Views, FortuneCookie, Redis } from './connectors';

const client = Redis.createClient();

const resolvers = {
  Query: {
    user(_, args) {
      return User.find({
        where: { id: args.id }
      });
    },
    async public_feed() {
      const feed = await client.lrangeAsync('public_feed', 0, -1);
      return feed.map(JSON.parse);
    }
  },
  User: {
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
      return Views
        .findOne({ tweetId: tweet.id })
        .then((doc) => doc.views);
    }
  }
};

export default resolvers;
