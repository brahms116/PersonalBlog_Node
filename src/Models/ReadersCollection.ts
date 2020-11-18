import Model from '../Abstract/Model'
import ReftoId from '../utils/ReftoId'
import Reader,{ReaderResponse} from './Reader'
import {CollectionCreateData,CollectionResponse} from './ModelInterface'


export interface ReadersCollectionResponse extends CollectionResponse{
    data:[string,string][]
}
export default class ReadersCollection extends Model{


    static createFromData(data:CollectionCreateData){
        return new ReadersCollection(data.size,data.cursor)
    }

    public get data(){
        return{
            cursor:this._cursor,
            readers:this._collection.map(x=>x.data)
        }
    }

    public constructor(private _size:number|undefined,private _cursor:string|undefined){
        super()
    }

    

    
    //this function only returns a page of readers, should've implemented like the other posts collection where all the ids could be fetched.
    public async findAll(){
        try {
            
            let opts ={}
            if(this._size){
                if(this._cursor){
                    opts={
                        size:this._size,
                        after:[this._q.Ref(this._q.Collection("Reader"),this._cursor)]
                    }
                }   
                else{
                    opts = {
                        size:this._size
                    }
                }
            }
            const res:ReadersCollectionResponse = await this._fauna.fclient.query(               
                    this._q.Paginate(
                        this._q.Match("all_readers_with_email"),
                        opts
                    ),
            )
            console.log(res)
            if(res.after && res.after![3]!=null){                
                    this._cursor = res.after[3].toString()
                    this._cursor = ReftoId(this._cursor)     
            }else{
                this._cursor="LP"
            }
            for(let x of res.data){
                const cursor = ReftoId(x[1].toString())
                 this._collection.push(Reader.createReaderFromData({ref:cursor,email:x[0]}))
            }
            
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    private _collection:Array<Reader> = []
    

}