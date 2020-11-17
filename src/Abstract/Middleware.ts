import express from 'express'
import Server from '../Server';


export default abstract class Middleware{
        
    public constructor(private server:Server){
        this._app=server.expressApp
    }
    public abstract setup():void 

    protected _app:express.Express
 }