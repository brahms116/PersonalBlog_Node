import express from "express";
import Server from "../Server";
import Upload from "../Multer";
import ReadJson from "../../napi_blog";
import Post, { createPostData } from "../Models/Post";
export default class Rest {
    private _app: express.Express;

    public constructor(server: Server) {
        this._app = server.expressApp;
        this._setup();
    }

    private _setup() {
        this._app.use(
            "/rest/uploadpost",
            Upload.single("post"),
            async (req, res) => {
                if (req.file) {
                    const result: createPostData = JSON.parse(
                        ReadJson(req.file.path)
                    );
                    try {
                        const post = Post.createFromData(result);
                        const faunaRes = await post.create();
                        return res.send(faunaRes);
                    } catch (error) {
                        return res.status(500).send(error);
                    }
                } else {
                    return res.status(400).send("missing file");
                }
            }
        );
    }
}
