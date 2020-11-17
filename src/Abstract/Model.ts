import Fauna from "../Fauna/Fauna"
import {query as q} from 'faunadb'


export default abstract class Model {
    constructor(){
        this._fauna = new Fauna(process.env.FAUNASECRET!)

    }
    protected _fauna:Fauna
    protected _q = q
}