import express from 'express'
import Server from '../Server';

export default class Auth{


    public constructor(server:Server){
        this._app=server.expressApp
        this._setup()
    }
    

    private _setup(){
        this._app.use('*',(req,res,next)=>{
            const bearerToken = req.header("Authorization")
            // console.log(bearerToken)
            if(bearerToken){
                const token = bearerToken.replace(/Bearer\s/,'')
                // console.log(token)
                if(token===process.env.SERVERSECRET as string){
                    next()
                    return
                }
            }
            res.status(401).send("Incorrect server credentials")
            return
        })
    }


    private _app:express.Express
}