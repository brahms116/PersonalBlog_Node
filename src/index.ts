import express from 'express'
import {graphqlHTTP} from 'express-graphql'
import {buildSchema} from 'graphql'
import dotenv from 'dotenv'

const schema = buildSchema(`
    type Query{
        message:String
    }
`)

const root ={
    message:()=>"hello world"
}
const app = express()
dotenv.config()

app.use("/graphql",graphqlHTTP({
    schema:schema,
    rootValue: root,
    graphiql:true
}))


app.listen(process.env.PORT as string,()=>{
    console.log(`Server started on port ${process.env.PORT}`)
}
)
