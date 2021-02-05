import express from "express";
import Server from "../Server";
import Upload from "../Multer";
import ReadJson from "../../napi_blog";
import Post, { createPostData } from "../Models/Post";
import { ResponseError } from "../Graphql/Root";
import ReadersCollection from "../Models/ReadersCollection";
import fetch from "node-fetch";
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
                        //this is to trigger the rebuild on the next client
                        await fetch(
                            `https://blog.davidkwong.net/posts/${faunaRes.data.id}`
                        );
                        const allReaders = ReadersCollection.createFromData({});
                        const readersList = await allReaders.findAll();
                        let emails: string[] = [];
                        let ids: string[] = [];
                        for (const reader of readersList.data.readers) {
                            emails.push(reader.email!);
                            ids.push(reader.id!);
                        }
                        if (process.env.ADMIN_ADDRESS) {
                            const gmailRes = await fetch(
                                process.env.ADMIN_ADDRESS +
                                    "/google/blog/newpost",
                                {
                                    method: "POST",
                                    body: JSON.stringify({
                                        emails,
                                        ids,
                                        postId: faunaRes.data.id,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${process.env
                                            .ADMIN_SECRET!}`,
                                    },
                                }
                            );
                            console.log(gmailRes);
                        } else {
                            throw "env not set";
                        }
                        return res.send(faunaRes);
                    } catch (error) {
                        console.log(error);
                        return res.status(400).send(new ResponseError(error));
                    }
                } else {
                    return res.status(400).send("missing file");
                }
            }
        );
    }
}
