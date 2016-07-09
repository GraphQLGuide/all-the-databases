const schema = [`
type User {
  firstName: String
  lastName: String
  photo: String
  tweets: [Tweet]
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
  public_feed: [Tweet]
}

schema {
  query: Query
}
`];

export default schema;
