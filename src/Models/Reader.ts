import Model from "../Abstract/Model";
import ReftoId from "../utils/ReftoId";

export interface ReaderInput{
   email:string
}

interface ReaderCreateData{
    email?:string;
    ref?:string;
}

export interface ReaderResponse{
    ref:string
    ts:number
    data:any
}


export default class Reader extends Model{

    static createReaderFromData(data:ReaderCreateData){
        return new Reader(data.email,data.ref)
    }

    
    public get data() {
        return{
            email:this._email,
            ref:this._ref
        }
    }

    public constructor(private _email:string|undefined, private _ref:string|undefined){
        super()
    }

    public async findByEmail(){
        try {
            if(this._email){
                const res:ReaderResponse = await this._fauna.fclient.query(
                    this._q.Get(
                        this._q.Match(this._q.Index('Readers_by_email'),this._email)
                    )
                )
                this._ref = ReftoId( res.ref.toString())
                this._email = res.data.email
                return this
            }
            else{
                throw "email not set"
            }
        } catch (error) {
            throw error
        }
    }

    public async create(){
        try {
            try {
                const res = await this.findByEmail()
                if(res){throw "Email Already Exists"}
            } catch (error) {
                if(error.description==="Set not found."){
                    const res:ReaderResponse =await this._fauna.fclient.query(
                       this._q.Create(
                           this._q.Collection("Reader"),{
                               data:{
                                   email:this._email
                               }
                           }
                       )
                   )
                   this._ref =ReftoId( res.ref.toString())
                }
                else{
                    console.log(error)
                    throw error
                }
            }       
            return this
        } catch (error) {
            console.log(error)
            throw error.toString()
        }

    }

    public async delete(){
        try {
           await this.findByEmail()
           await this._fauna.fclient.query(
               this._q.Delete(
                   this._q.Ref(this._q.Collection("Reader"),this._ref)
               )
            )
            return this

        } catch (error) {
            console.log(error)
            throw error.toString()
        }
    }

    
}

