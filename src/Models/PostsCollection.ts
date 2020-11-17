import Model from "../Abstract/Model";
import {CollectionResponse, CollectionCreateData } from "./CollectionInterface";
import Post, {PostResponse} from './Post'
import ReftoId from '../utils/ReftoId'

interface PostsCollectionResponse extends CollectionResponse{
    data:PostResponse[]
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
                    this._q.Map(
                        this._q.Paginate(
                            this._q.Match("allPosts"),
                            tempAfter?{after:[this._q.Ref(this._q.Collection("Post"),tempAfter)]}:{}
                        ),
                        this._q.Lambda("x",this._q.Get(this._q.Var("x")))
                    )
                )
                // console.log(res)
                if(!res.after){
                    isthereMore=false
                }else{
                    tempAfter=ReftoId(res.after.toString())
                }
                for(let x of res.data){
                    result.push(ReftoId(x.ref.toString()))
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
            
            let opts ={}
            if(this._size){
                if(this._cursor){
                    opts={
                        size:this._size,
                        after:[this._q.Ref(this._q.Collection("Post"),this._cursor)]
                    }
                }   
                else{
                    opts = {
                        size:this._size
                    }
                }
            }
            const res:PostsCollectionResponse = await this._fauna.fclient.query(
                this._q.Map(
                    this._q.Paginate(
                        this._q.Match("Posts_by_date"),
                        opts
                    ),
                    this._q.Lambda(["data","x"],this._q.Get(this._q.Var("x")))
                )
            )
            // console.log(res)
            if(res.after && res.after![0]!=null){                
                    this._cursor = res.after[0].toString()
                    this._cursor = ReftoId(this._cursor)     
            }
            for(let x of res.data){
                const cursor = ReftoId(x.ref.toString())
                this._collection.push(Post.createFromData({ref:cursor,...x.data}))
            }
            if(res.before){
                this._cursor="LP"
            }
            console.log(this._collection)
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    private _collection:Post[] = []
}