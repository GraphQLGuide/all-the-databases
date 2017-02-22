import rp from 'request-promise';
import { User, Tweet, Views, Elasticsearch, redis } from './connectors';

const resolvers = {
  Query: {
    user(_, args) {
      return User.find({
        where: { id: args.id },
      });
    },
    async publicFeed() {
      const feed = await redis.lrangeAsync('public_feed', 0, -1);
      return feed.map(JSON.parse);
    },
    async cityFeed(_, args, context) {
      const response = await rp(`http://ipinfo.io/${context.ip}`);
      const { city } = JSON.parse(response);
      // {
      //   "ip": "8.8.8.8",
      //   "hostname": "google-public-dns-a.google.com",
      //   "city": "Mountain View",
      //   "region": "California",
      //   "country": "US",
      //   "loc": "37.3860,-122.0838",
      //   "org": "AS15169 Google Inc.",
      //   "postal": "94040"
      // }

      const cityTweets = await Tweet.findAll({
        where: { city },
        limit: 3,
        order: [['created', 'DESC']],
      });

      return cityTweets;
    },
  },
  User: {
    async mentions(user) {
      const results = await Elasticsearch.search({ q: `${user.firstName} ${user.lastName}` });
      return results.hits.hits.map(hit => Tweet.build({ ...hit._source, id: hit._id }));
    },
  },
  Tweet: {
    author(tweet) {
      // in Redis, author is a subdoc
      if (tweet.user) {
        return tweet.user;
      }

      return tweet.getUser();
    },
    views(tweet) {
      return Views
        .findOne({ tweetId: tweet.id })
        .then(doc => doc.views);
    },
  },
};

export default resolvers;
