import Sequelize from 'sequelize';
import Mongoose from 'mongoose';
import rp from 'request-promise';
import Redis from 'redis';
import bluebird from 'bluebird';
import _ from 'lodash';
import casual from 'casual';


// SQL

const db = new Sequelize('twitter', null, null, {
  dialect: 'sqlite',
  storage: './twitter.sqlite'
});

const UserModel = db.define('user', {
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING },
  photo: { type: Sequelize.STRING }
});

const TweetModel = db.define('tweet', {
  text: { type: Sequelize.STRING },
  created: { type: Sequelize.INTEGER }
});

UserModel.hasMany(TweetModel);
TweetModel.belongsTo(UserModel);


// MongoDB

const mongo = Mongoose.connect('mongodb://localhost/views');

const ViewsSchema = Mongoose.Schema({
  tweetId: Number,
  views: Number
});

const Views = Mongoose.model('views', ViewsSchema);


// Redis

bluebird.promisifyAll(Redis.RedisClient.prototype);
bluebird.promisifyAll(Redis.Multi.prototype);


// REST

const FortuneCookie = {
  getOne() {
    return rp('http://fortunecookieapi.com/v1/cookie')
      .then(JSON.parse)
      .then((res) => res[0].fortune.message);
  }
};


// Seed SQL & Mongo

casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, (i) => {
    return UserModel.create({
      id: i + 1,
      firstName: casual.first_name,
      lastName: casual.last_name,
      photo: 'http://placekitten.com/200/139'
    }).then((user) => {
      return user.createTweet({
        text: casual.sentences(1),
        created: Date.now() - i * 1000
      }).then((tweet) => {
        return Views.update(
          { tweetId: tweet.id },
          { views: casual.integer(0, 100) },
          { upsert: true });
      });
    });
  });
});


// Seed Redis

const client = Redis.createClient();

client.on("error", function (err) {
  // console.log("Error " + err);
});

_.times(10, (i) => {
  const tweet = {
    id: i + 1,
    text: casual.sentences(1),
    author: {
      firstName: casual.first_name,
      lastName: casual.last_name,
      photo: 'http://placekitten.com/200/139'
      
    },
    created: Date.now() - i * 1000
  };

  client.lpush('public_feed', JSON.stringify(tweet));
});

client.ltrim('public_feed', 0, 9);

client.lrange('public_feed', 0, -1, (err, replies) => {
  replies.forEach((reply, i) => {
    console.log('Added to Redis #' + i, JSON.parse(reply));
  });
});


// Export

const User = db.models.user;
const Tweet = db.models.tweet;

export { User, Tweet, Views, FortuneCookie, Redis };


