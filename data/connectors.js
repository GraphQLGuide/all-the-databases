import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import elasticsearch from 'elasticsearch';
import Redis from 'redis';
import bluebird from 'bluebird';
import _ from 'lodash';
import casual from 'casual';


// SQL

const sql = new Sequelize('twitter', null, null, {
  dialect: 'sqlite',
  storage: './twitter.sqlite',
});

const UserModel = sql.define('user', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  photo: { type: Sequelize.STRING },
});

const TweetModel = sql.define('tweet', {
  text: { type: Sequelize.STRING },
  created: { type: Sequelize.INTEGER },
  city: { type: Sequelize.STRING },
});

UserModel.hasMany(TweetModel);
TweetModel.belongsTo(UserModel);


// MongoDB

Mongoose.connect('mongodb://localhost/views');

const ViewsSchema = Mongoose.Schema({ // eslint-disable-line
  tweetId: Number,
  views: Number,
});

const Views = Mongoose.model('views', ViewsSchema);


// Elasticsearch

const Elasticsearch = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});


// Redis

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);


// Seed SQL, Elasticsearch, & Mongo

const seed = () => {
  casual.seed(123);

  sql.sync({ force: true }).then(() => {
    _.times(10, (i) => {
      const id = i + 1;
      return UserModel.create({
        id,
        firstName: casual.first_name,
        lastName: casual.last_name,
        photo: 'http://placekitten.com/200/139',
      }).then((user) => {
        const tweetData = {
          text: casual.sentences(1),
          created: Date.now() - i * 1000,
          city: Math.random() < 0.5 ? 'Mountain View' : 'San Francisco',
        };

        const esTweet = _.extend(tweetData, {
          text: `${user.firstName} ${user.lastName} ${casual.sentences(1)}`,
          userId: id,
        });

        Elasticsearch.create({
          index: 'twitter',
          type: 'tweet',
          id: id + 10,
          body: esTweet,
        }, (e, r) => {
          console.log('Inserted into Elasticsearch tweet with id', r._id);
        });

        return user.createTweet(tweetData).then((tweet) => {
          return Views.update(
            { tweetId: tweet.id },
            { views: casual.integer(0, 100) },
            { upsert: true });
        });
      });
    });
  });
};

Elasticsearch.indices.delete({ index: 'twitter' }).then(seed, seed);


// Seed Redis

const client = Redis.createClient();

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

_.times(3, (i) => {
  const tweet = {
    id: i + 1,
    text: casual.sentences(1),
    user: {
      firstName: casual.first_name,
      lastName: casual.last_name,
      photo: 'http://placekitten.com/200/139',
    },
    city: 'New York',
    created: Date.now() - i * 1000,
  };

  client.lpush('public_feed', JSON.stringify(tweet));
});

client.ltrim('public_feed', 0, 2);

client.lrange('public_feed', 0, -1, (err, replies) => {
  replies.forEach((reply, i) => {
    console.log(`Added to Redis tweet #${i}`, JSON.parse(reply));
  });
});


// Export

const User = sql.models.user;
const Tweet = sql.models.tweet;

export { User, Tweet, Views, Elasticsearch, Redis };
