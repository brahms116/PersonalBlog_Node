
import dotenv from 'dotenv'
import Server from './Server'
import Graphql from './Graphql/Graphql'
import Auth from './Auth/Auth'
dotenv.config()

const server = new Server(+process.env.PORT!)
const auth = new Auth(server)
const graphql = new Graphql(server)



server.startServer()


