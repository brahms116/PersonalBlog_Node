import Post, { PostInputData } from '../Models/Post'
import Reader, {ReaderInput} from '../Models/Reader'
import ReadersCollection from '../Models/ReadersCollection'
import PostsCollection from '../Models/PostsCollection'
import {CollectionInput} from '../Models/CollectionInterface'


class ResponseError{
    public isError=true;
    public constructor(public msg:string){}
}

export default class Root{

    public constructor(){
    }

    public root = {
        async createReader(input:ReaderInput){
            // console.log(input)
            try {
                const reader = Reader.createReaderFromData({email:input.email})
                const res = await reader.create()
                return res.data
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }
        },
        async allReaders({input}:CollectionInput){
            // console.log(input)  
            try {
                const page = ReadersCollection.createFromData(input?input:{})
                const res = await page.findAll()
                return res.data
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }

        },
        async createPost({input}:PostInputData){
            
            try {
                const post = Post.createFromData(input?{createdAt:Date.now(),...input}:{})
                const res = await post.create()
                return res.data
                
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }
        },
        async getPostById(input:{id:string}){
            try {
                const post = Post.createFromData({ref:input.id})
                const res = await post.getByID()
                return res.data
                
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }
        },
        async allPostsByDate({input}:CollectionInput){
            try {
                const page = PostsCollection.createFromData(input?input:{})
                const res = await page.findPosts()
                return res.data
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }

        }

    }

}


