const schema = [`
type User {
  firstName: String
  lastName: String
  photo: String
  tweets: [Tweet]
  mentions: [Tweet]
  fortune: String
}

type Tweet {
  text: String
  author: User
  created: Float
  views: Int
}

type Query {
  user(id: Int): User
  follower_feed(userId: Int): [Tweet]
  public_feed: [Tweet]
  city_feed: [Tweet]
}

schema {
  query: Query
}
`];

export default schema;
