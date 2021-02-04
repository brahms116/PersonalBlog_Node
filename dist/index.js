"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var Server_1 = __importDefault(require("./Server"));
var Graphql_1 = __importDefault(require("./Graphql/Graphql"));
var Auth_1 = __importDefault(require("./Auth/Auth"));
var Rest_1 = __importDefault(require("./Rest/Rest"));
dotenv_1.default.config();
var server = new Server_1.default(+process.env.PORT);
new Auth_1.default(server);
new Graphql_1.default(server);
new Rest_1.default(server);
server.startServer();
