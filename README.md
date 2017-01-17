# All the Databases

A GraphQL server tutorial combining 5 data sources

Code written in the tutorial can be found in:

- [server.js](https://github.com/GraphQLGuide/all-the-databases/blob/master/server.js)
- [data/schema.js](https://github.com/GraphQLGuide/all-the-databases/blob/master/data/schema.js)
- [data/resolvers.js](https://github.com/GraphQLGuide/all-the-databases/blob/master/data/resolvers.js)

There's also database, ORM, and seeding code in [data/connectors.js](https://github.com/GraphQLGuide/all-the-databases/blob/master/data/connectors.js).

## Browse data

TODO link to hosted graphiql, then [try out a query](#query)

## Run locally

Get the code:

```sh
git clone git@github.com:GraphQLGuide/all-the-databases.git
cd all-the-databases
npm install
```

Get the databases:

```
brew install redis
brew install elasticsearch
brew install mongodb
```

Run one command per terminal tab:

```
mongod
```

```
redis-server /usr/local/etc/redis.conf
```

```
elasticsearch
```

Then in the `all-the-databases/` directory, run the GraphQL server:

```
npm start
```

Then open:

[localhost:8080/graphiql](http://localhost:8080/graphiql)

Then query:

## Query

![GraphiQL screenshot](https://www.dropbox.com/s/gteo8r98tztgz7n/Screenshot%202017-01-04%2018.13.59.png?raw=1)

When you paste this on the left side of the GraphiQL page:

```
{
  user(id: 1) {
    firstName
    lastName
    photo
    mentions {
      ...TweetDetails
    }
  }      
  publicFeed {
    ...TweetDetails
  }
  cityFeed {
    ...TweetDetails
  }
}

fragment TweetDetails on Tweet {
  text
  author {
    firstName
    lastName
    photo
  }      
  city
  views
  created
}
```

and hit the play button (or `cmd-return`), then you should get something like this on the right:

```json
{
  "data": {
    "user": {
      "firstName": "Maurine",
      "lastName": "Rau",
      "photo": "http://placekitten.com/200/139",
      "mentions": [
        {
          "text": "Maurine Rau Eligendi in deserunt.",
          "author": {
            "firstName": "Maurine",
            "lastName": "Rau",
            "photo": "http://placekitten.com/200/139"
          },
          "city": "San Francisco",
          "views": 82,
          "created": 1481757217713
        }
      ]
    },
    "publicFeed": [
      {
        "text": "Corporis qui impedit cupiditate rerum magnam nisi velit aliquam.",
        "author": {
          "firstName": "Tia",
          "lastName": "Berge",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "New York",
        "views": 91,
        "created": 1481757215183
      },
      {
        "text": "Aut numquam aut dolorem.",
        "author": {
          "firstName": "Soledad",
          "lastName": "White",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "New York",
        "views": 69,
        "created": 1481757216183
      },
      {
        "text": "Consequatur voluptates eaque voluptatem neque assumenda omnis.",
        "author": {
          "firstName": "Arlo",
          "lastName": "Kertzmann",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "New York",
        "views": 51,
        "created": 1481757217182
      }
    ],
    "cityFeed": [
      {
        "text": "Edmond Jones Harum ullam pariatur quos est quod.",
        "author": {
          "firstName": "Edmond",
          "lastName": "Jones",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "Mountain View",
        "views": 69,
        "created": 1481757216723
      },
      {
        "text": "Katlyn Reichert Quos sequi molestiae beatae.",
        "author": {
          "firstName": "Katlyn",
          "lastName": "Reichert",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "Mountain View",
        "views": 55,
        "created": 1481757214738
      },
      {
        "text": "Jayde Conn Occaecati rerum neque et.",
        "author": {
          "firstName": "Jayde",
          "lastName": "Conn",
          "photo": "http://placekitten.com/200/139"
        },
        "city": "Mountain View",
        "views": 85,
        "created": 1481757209779
      }
    ]
  }
}
```
