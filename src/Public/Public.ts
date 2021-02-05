import express from "express";
import path from "path";
import { ResponseError } from "../Graphql/Root";
import Reader from "../Models/Reader";
import Server from "../Server";

export default class Public {
    private _app: express.Express;

    public constructor(server: Server) {
        this._app = server.expressApp;
        this._setup();
    }

    private _setup() {
        this._app.get("/favicon.ico", (req, res) => {
            res.sendFile(path.join(__dirname, "../../public", "favicon.ico"));
        });
        this._app.get("/globals.css", (req, res) => {
            res.sendFile(path.join(__dirname, "../../public", "globals.css"));
        });
        this._app.get("/unsubscribe/:id", async (req, res) => {
            const id = req.params.id! as string;
            console.log(`id is ${id}`);
            try {
                const reader = Reader.createReaderFromData({ ref: id });
                const result = await reader.delete();
                res.sendFile(
                    path.join(__dirname, "../../public", "unsub.html")
                );
            } catch (err) {
                console.log(`logged from route: ${err}`);
                return res
                    .status(400)
                    .sendFile(
                        path.join(__dirname, "../../public", "Oops.html")
                    );
            }
        });
    }
}
