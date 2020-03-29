var express = require('express')
var graphqlHTTP = require('express-graphql')
var { buildSchema } = require('graphql')
var cors = require('cors')

const posts = []
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
    getPosts: [Post]
  }
   
  type Mutation {
    addPost(input: PostInput): Post
    editPost(id:String , input: PostInput): Post
  }
`)


// The root provides a resolver function for each API endpoint
var root = {
  getPosts: () => {
    console.log(posts);

    return posts
  },

  addPost: (payload) => {

    const newPost = { id: posts.length.toString(), ...payload.input };
    posts.push(newPost);
    console.log("posts", posts);

    return newPost;
  },

  editPost: (payload) => {
    console.log("payload@@@@", payload);

    const postId = posts.findIndex(post => payload.id === post.id);
    const newPost = { ...payload.input, id: postId };
    posts[postId] = newPost;
    // console.log("posts", posts);

    return newPost;
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
