var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')

const data = ['ff', 'ggg']
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    getData: [String]
    addItem(text: String): String
  }
`)

// The root provides a resolver function for each API endpoint
var root = {
  getData: () => {
    console.log(data)
    return data
  },
  addItem: ({text}) => {
    console.log(text)
    data.push(text)
    return 'Done'
  }
}

var app = express()
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/graphql')
