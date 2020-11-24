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
            

            const tempAfter = null
            let isThereMore = true
            while(isThereMore){
                const res:ReadersCollectionResponse = await this._fauna.fclient.query(               
                        this._q.Paginate(
                            this._q.Match("all_readers_with_email"),
                            tempAfter?{after:tempAfter}:{}
                        ),
                )
                console.log(res)
                if(!res.after){
                    isThereMore = false                
                }
                else{
                    this._cursor = res.after[0]    
                }
                for(let x of res.data){
                    const cursor = ReftoId(x[1].toString())
                    this._collection.push(Reader.createReaderFromData({ref:cursor,email:x[0]}))
                }
            }
            
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    private _collection:Array<Reader> = []
    

}