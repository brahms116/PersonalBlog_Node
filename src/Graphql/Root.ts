import Post, { PostInputData } from '../Models/Post'
import Reader, {ReaderInput} from '../Models/Reader'
import ReadersCollection from '../Models/ReadersCollection'
import PostsCollection from '../Models/PostsCollection'
import {CollectionInput} from '../Models/ModelInterface'


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
                if(process.env.ADMIN_ADDRESS){
                    
                    const gmailRes = await fetch(process.env.ADMIN_ADDRESS+'/google/blog/newsub',{
                        method:'POST',
                        body:`{"emails":["${res.data.email}"]}`,
                        headers:{
                            'Content-Type':'application/json',
                            'Authorization':`Bearer ${process.env.ADMIN_SECRET!}`
                        }
                    })
                    console.log(gmailRes)
                    }
                    else{
                        throw 'env not set'
                    }
                return res.data
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }
        },
        async AllReaders(){
            // console.log(input)  
            try {
                const page = ReadersCollection.createFromData({})
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
        async getPostHeadingsByDate({opts}:CollectionInput){
            // console.log(opts)
            try {
                const page = PostsCollection.createFromData(opts?opts:{})
                const res = await page.findPosts()
                return res.data
            } catch (error) {
                console.log(error)
                return new ResponseError(error)
            }

        },
        async deleteReader(input:{email:string}){
            try{
                const reader = Reader.createReaderFromData({email:input.email})
                const res = await reader.delete()
                return res.data
            }catch(err){
                console.log(err)
                return new ResponseError(err)
            }
        },
        async AllPostId(){
            try {
                const collection = PostsCollection.createFromData({})
                const res = await collection.getAllId()
                return {
                    ids:res
                }
            } catch (err) {
                console.log(err)
                return new ResponseError(err)
            }
        }

    }

}


