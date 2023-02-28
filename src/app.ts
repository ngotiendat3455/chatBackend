import { config } from './config';
import { ChattyServer } from './setupServer';
import express, { Express } from 'express';
import databaseConnection from './setupDatabase';

class Application{
    public initialize():void{
        this.loadConfig();
        const app: Express = express();
        databaseConnection();
        const chatServer = new ChattyServer(app);
        chatServer.start();
    }
    private loadConfig(){
        config.validateConfig();
    }
}

const application = new Application();
application.initialize();
