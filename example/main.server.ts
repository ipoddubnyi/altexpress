import { Application } from "@altcrm/altexpress";
import { ApplicationModule } from "./application.module";

class Server {
    public async start(): Promise<void> {
        try {
            console.log("Configuring API...");
            const app = new Application(ApplicationModule);
            this.configure(app);

            console.log("Starting API...");
            const port = 8888;
            await app.listen(port);
            console.log(`Server is running: http://localhost:${port}/`);
        } catch (e: any) {
            console.error(e);
        }
    }

    private configure(app: Application): void {
        //app.setGlobalPrefix("/api/v1");
        //app.use(express.urlencoded({ extended: true }));
        //app.use(express.json());
    }
}

new Server().start();
