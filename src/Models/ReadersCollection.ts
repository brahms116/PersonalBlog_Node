import Model from '../Abstract/Model'
import ReftoId from '../utils/ReftoId'
import Reader,{ReaderResponse} from './Reader'
import {CollectionCreateData,CollectionResponse} from './CollectionInterface'


export interface ReadersCollectionResponse extends CollectionResponse{
    data:Array<ReaderResponse>
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
                this._q.Map(
                    this._q.Paginate(
                        this._q.Match("allReaders"),
                        opts
                    ),
                    this._q.Lambda("x",this._q.Get(this._q.Var("x")))
                )
            )
            // console.log(this._cursor)
            if(res.after && res.after![0]!=null){                
                    this._cursor = res.after[0].toString()
                    this._cursor = ReftoId(this._cursor)     
            }
            for(let x of res.data){
                const cursor = ReftoId(x.ref.toString())
                 this._collection.push(Reader.createReaderFromData({ref:cursor,email:x.data.email}))
            }
            if(res.before){
                this._cursor="LP"
            }
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    private _collection:Array<Reader> = []
    

}