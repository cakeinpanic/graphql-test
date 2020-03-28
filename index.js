var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var cors = require('cors')

const data = [{ id: '1', author: 'gandalf', text: 'ddd' }]
// Construct a schema, using GraphQL schema language


var schema = buildSchema(`
  input PostInput {
    author: String
    text: String
  }

  scalar Post {
    id: String
    author: String
    text: String
  }
  
  type Query {
    getData: [Post]
  }
   
  type Mutation {
    addItem(input: PostInput): String
  }
`)


// The root provides a resolver function for each API endpoint
var root = {
  getData: () => {
    // console.log(data)
    return data
  },
  addItem: (post) => {
    console.log("post", post);

    data.push({ ...post, id: data.length.toString() })
    console.log("data", data);

    return 'Done'
  }
}

var app = express()

app.use(cors({
  origin: '*'
}))
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
