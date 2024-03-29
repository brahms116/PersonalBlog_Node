import Model from "../Abstract/Model";
import {CollectionResponse, CollectionCreateData } from "./ModelInterface";
import Post, {PostResponse} from './Post'
import ReftoId from '../utils/ReftoId'

interface PostsCollectionResponse extends CollectionResponse{
    data:[number,string,string,string][]
}
export default class PostsCollection extends Model{

    static createFromData(data:CollectionCreateData){

        return new PostsCollection(data.size,data.cursor)
    }
    public constructor(private _size:number|undefined,private _cursor:string|undefined){
        super()
    }

    public get data(){
        return{
            cursor:this._cursor,
            posts:this._collection.map(x=>x.data)
        }
    }

    public async getAllId(){
        let isthereMore = true
        let tempAfter = null
        let result:string[] = []
        try {
            while(isthereMore){
                const res:PostsCollectionResponse = await this._fauna.fclient.query(                    
                        this._q.Paginate(
                            this._q.Match("Posts_by_date"),
                            tempAfter?{after:[tempAfter]}:{}
                        )
                )
                //console.log(res)
                if(!res.after){
                    isthereMore=false
                }else{
                    tempAfter=res.after[0];
                }
                for(let x of res.data){
                    result.push(ReftoId(x[3].toString()))
                }
            }
            return result
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    public async findPosts(){
        try {
            
            //console.log(this._cursor)
            
            let opts ={}
            if(this._size){
                if(this._cursor){
                    // console.log(this._cursor)
                    opts={
                        size:this._size,
                        after:+this._cursor
                    }

                }   
                else{
                    opts = {
                        size:this._size
                    }
                }
            }
            // console.log(opts)

            const res:PostsCollectionResponse = await this._fauna.fclient.query(
               
                    this._q.Paginate(
                        this._q.Match("Posts_by_date"),
                        opts
                    )
                
            )
            if(res.after){                
                    this._cursor = res.after[0] 
            }else{
                this._cursor="LP"
            }
            for(let x of res.data){
                const cursor = ReftoId(x[3].toString())
                this._collection.push(Post.createFromData({ref:cursor,createdAt:x[0],title:x[1],description:x[2]}))
            }
            
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    private _collection:Post[] = []
}