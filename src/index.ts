
import dotenv from 'dotenv'
import Server from './Server'
import Graphql from './Graphql/Graphql'
dotenv.config()

const server = new Server(+process.env.PORT!)
const graphql = new Graphql(server)



server.startServer()


