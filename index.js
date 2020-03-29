const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const cors = require('cors')

let uniqueId = 0;
let posts = []
// Construct a schema, using GraphQL schema language

const schema = buildSchema(`
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
    deletePost(id:String): String
  }
`)


// The root provides a resolver function for each API endpoint
const root = {
  getPosts: () => {
    console.log(posts);

    return posts
  },

  addPost: (payload) => {

    const newPost = { id: uniqueId.toString(), ...payload.input };
    uniqueId++;
    posts.push(newPost);
    console.log("posts", posts);

    return newPost;
  },

  editPost: (payload) => {

    const postIndex = posts.findIndex(post => payload.id === post.id);
    const newPost = { ...payload.input, id: payload.id };
    posts[postIndex] = newPost;

    return newPost;
  },

  deletePost: (payload) => {
    console.log("payload@@@@", payload);

    const postIndex = posts.findIndex(post => payload.id === post.id);
    posts.splice(postIndex, 1);

    return payload.id;
  }
}

const app = express()

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
