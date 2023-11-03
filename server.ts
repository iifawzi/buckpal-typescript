import http from "http"
import { BaseApp } from './interfaces';
export default class Server {

    private static serverInstance: http.Server;

    private constructor(private app: BaseApp) {
        this.app = app;
        const port = process.env.PORT || 4040;
        Server.serverInstance = http.createServer(this.app.getInstance);
        Server.serverInstance.listen(port, () => {
            if (process.env.NODE_ENV != 'test') {
                console.log(`Server is listening on Port ${port}`);
            }
        });
    };

    public static getServer(app: BaseApp): http.Server {
        if (!Server.serverInstance) {
            new Server(app);
        }
        return Server.serverInstance;
    }
}

