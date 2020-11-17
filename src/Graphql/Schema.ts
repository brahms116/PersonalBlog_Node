import {buildSchema} from 'graphql'

const schema = buildSchema(`
  

    type Query{
        allReaders(opts:PaginationInput):ReadersPage
        getPostById(id:String):Post
        allPostsByDate(opts:PaginationInput):PostsPage
    }


    type Mutation{
        createReader(email:String!):Reader
        deleteReader(email:String!):Reader
        createPost(input:PostInput):Post
    }

    input PaginationInput{
        size:Int
        cursor:String
    }

    interface Response {
        isError:Boolean
        msg:String
    }

    type Post implements Response{
        ref:String
        title:String
        createdAt:Int
        description:String
        src:String
        para:[String!]
        isError:Boolean
        msg:String
    }

    type PostsPage implements Response{
        cursor:String
        isError:Boolean
        msg:String
        posts:[Post!]
    }

    type ReadersPage implements Response{
        cursor:String
        isError:Boolean
        msg:String
        readers:[Reader!]
    }

    type Reader implements Response{
        ref:String
        email:String
        isError:Boolean
        msg:String
    }

    input PostInput{
        title:String!
        description:String!
        src:String
        para:[String!]!
    }

    


`)



export default schema