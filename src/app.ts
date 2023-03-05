import { config } from '@root/config';
import { ChattyServer } from '@root/setupServer';
import express, { Express } from 'express';
import databaseConnection from '@root/setupDatabase';

class Application {
  public initialize(): void {
    this.loadConfig();
    const app: Express = express();
    databaseConnection();
    const chatServer = new ChattyServer(app);
    chatServer.start();
  }
  private loadConfig() {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application = new Application();
application.initialize();
