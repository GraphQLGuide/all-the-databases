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
  user(id: Int!): User

  # A feed of the most recent tweets worldwide
  publicFeed: [Tweet]

  # A feed of the most recent tweets in your city
  cityFeed: [Tweet]
}

schema {
  query: Query
}
`;

export default schema;
