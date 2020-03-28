var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')

const data = [{id:'1', text:'ddd'}]
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  scalar Item {
    id: String
    text: String
  }
  type Query {
    getData: [Item]
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
    data.push({id: data.length.toString(), text})
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
