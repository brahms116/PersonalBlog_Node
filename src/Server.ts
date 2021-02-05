import express from "express";
import cors from "cors";
class Server {
    public constructor(port: number) {
        this._app = express();
        this._port = port;
        this._app.use(cors());
        this._app.use(express.static("public"));
    }
    public get expressApp() {
        return this._app;
    }
    public startServer() {
        this._app.listen(this._port, () => {
            console.log(`Server Started on port ${this._port}`);
        });
    }

    private _app: express.Express;
    private _port: number;
}

export default Server;
