import dotenv from "dotenv";
import Server from "./Server";
import Graphql from "./Graphql/Graphql";
import Auth from "./Auth/Auth";
import Rest from "./Rest/Rest";
dotenv.config();

const server = new Server(+process.env.PORT!);
new Auth(server);
new Graphql(server);
new Rest(server);

server.startServer();
