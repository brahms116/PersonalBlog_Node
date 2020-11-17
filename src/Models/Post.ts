import Model from "../Abstract/Model";
import ReftoId from "../utils/ReftoId";
import {graphQLData} from './ModelInterface'

type stringorundefined = string | undefined


export interface PostInputData{
    input:createPostData
}

// created at has to be in iso 8601??

export interface dbPostData{
    title?:string
    description?:string
    createdAt?:number
    src?:string
    para?:string[]
}

export interface createPostData extends dbPostData, graphQLData{}

export interface PostResponse{
    ref:string
    ts:number
    data:dbPostData  
}

export default class Post extends Model{


    static createFromData(input:createPostData){
        return new Post(input.ref,input.title,input.description,input.createdAt,input.src,input.para)
    }

    public get data(){
        return{
            title:this._title,
            ref:this._ref,
            description:this._description,
            createdAt:this._createdAt?.toString(),
            src:this._src,
            para:this._para
        }
    }

    public constructor(private _ref:stringorundefined, 
        private _title:stringorundefined, 
        private _description:stringorundefined,
        private _createdAt:number|undefined, 
        private _src:stringorundefined,
        private _para:string[]|undefined){
            super()
        }

    public async create(){
        try {
            // console.log(this.data)
            const res:PostResponse = await this._fauna.fclient.query(
                this._q.Create(
                    this._q.Collection("Post"),
                    {
                        data:{
                            title:this._title,
                            description:this._description,
                            createdAt:this._createdAt,
                            src:this._src,
                            para:this._para
                        }
                    }
                )
            )
            this._ref=ReftoId(res.ref.toString())
            console.log(res)
        } catch (error) {
            console.log(error)
            throw error.toString()
        }
        return this
    }

    public async getByID(){
        if(this._ref){
            const res:PostResponse = await this._fauna.fclient.query(
                this._q.Get(this._q.Ref(this._q.Collection("Post"),this._ref))
            )
            // console.log(res)
            this._title=res.data.title
            this._description=res.data.description
            this._src = res.data.src
            this._para = res.data.para
            this._createdAt = res.data.createdAt
        }else{
            throw "ID not set"
        }
        return this
    }
}