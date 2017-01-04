const schema = `
type User {
  firstName: String
  lastName: String
  photo: String
  mentions: [Tweet]
}

type Tweet {
  text: String
  author: User
  city: String
  views: Int
  created: Float
}

type Query {
  user(id: Int): User
  publicFeed: [Tweet]
  cityFeed: [Tweet]
}

schema {
  query: Query
}
`;

export default schema;
