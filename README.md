Solution to [Tutorial: How to build a GraphQL server](https://medium.com/apollo-stack/tutorial-building-a-graphql-server-cddaa023c035#.wy5h1htxs)

```sh
git clone git@github.com:apollostack/apollo-starter-kit.git
cd apollo-starter-kit
git checkout server-tutorial-solution
npm install
npm run start
```

And in another terminal:

```
mongod
```

Then open [http://localhost:8080](http://localhost:8080)

When you paste this on the left:

```
{
  author(firstName:"Edmond", lastName: "Jones"){
    firstName
    lastName
    posts{
      title
      views
    }
  }
  getFortuneCookie
}
```

and hit the play button (cmd-return), then you should get something like this on the right:

```json
{
  "data": {
    "author": {
      "firstName": "Edmond",
      "lastName": "Jones",
      "posts": [
        {
          "title": "A post by Edmond",
          "views": 92
        }
      ]
    },
    "getFortuneCookie": "A good conscience is a soft pillow."
  }
}
```  
