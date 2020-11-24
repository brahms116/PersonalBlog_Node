import {buildSchema} from 'graphql'

const schema = buildSchema(`
  

    type Query{
        AllReaders:ReadersPage
        getPostById(id:String):Post
        getPostHeadingsByDate(opts:PaginationInput):PostsPage
        AllPostId:AllId
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

    type AllId implements Response{
        isError:Boolean
        msg:String
        ids:[String!]
    }

    type Post implements Response{
        id:String
        title:String
        createdAt:String
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
        isError:Boolean
        msg:String
        readers:[Reader!]
    }

    type Reader implements Response{
        id:String
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