import dotenv from "dotenv";
import Server from "./Server";
import Graphql from "./Graphql/Graphql";
import Auth from "./Auth/Auth";
import Rest from "./Rest/Rest";
import Public from "./Public/Public";
dotenv.config();

const server = new Server(+process.env.PORT!);
new Public(server);
new Auth(server);
new Graphql(server);
new Rest(server);

server.startServer();
