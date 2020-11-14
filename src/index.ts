import express from 'express'
import express_graphql from 'express-graphql'
import {buildSchema} from 'graphql'
import dotenv from 'dotenv'

const app = express()
dotenv.config()
app.listen(process.env.PORT as string,()=>{
    console.log(`Server started on port ${process.env.PORT}`)
}
)
