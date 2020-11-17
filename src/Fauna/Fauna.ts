import faunadb from "faunadb"

export default class Fauna{

    public fclient:faunadb.Client

    public constructor(private _key:string){
        this.fclient = new faunadb.Client({secret:this._key})
        
    }
}