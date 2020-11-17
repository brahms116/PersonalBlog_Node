import {graphqlHTTP} from 'express-graphql'
import schema from './Schema'
import Root from './Root'


import Middleware from '../Abstract/Middleware'
import Server from '../Server'

export default class Graphql extends Middleware{
    public constructor(server:Server){
        super(server)
        this._roots = new Root()
        this.setup();
        
    }
    public setup(){
        this._app.use("/graphql",graphqlHTTP({
            schema:schema,
            rootValue: this._roots.root,
            graphiql:true
        }))
        
    }
    private _roots:Root

}