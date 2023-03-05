import { config } from '@root/config';
import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import cookieSection from 'cookie-session';
import compression from 'compression';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import applicationRoute from '@root/routes';
import 'express-async-errors';
import { CustomError, IErrorResponse } from './shared/globals/error-handlers';
import { StatusCodes } from 'http-status-codes';
// import { config } from './config';

const SERVER_PORT = 5000;
const log = config.createLogger('server');
export class ChattyServer {
  private app: Application;
  constructor(express: Application) {
    this.app = express;
  }

  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
    // this.startSocketIO(this.app)
    // this.startHttpServer(this.app)
  }
  private securityMiddleware(app: Application) {
    app.use(
      cookieSection({
        name: 'sesstion',
        keys: ['test1', 'test2'],
        maxAge: 24 * 7 * 3600000,
        secure: true
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }
  private standardMiddleware(app: Application) {
    app.use(compression());
    app.use(
      json({
        limit: '50mb'
      })
    );
    app.use(
      urlencoded({
        extended: true,
        limit: '50mb'
      })
    );
  }
  private routesMiddleware(app: Application) {
    applicationRoute(app);
  }
  private globalErrorHandler(app: Application) {
    app.all('*', (error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error('all',error);
      res.status(StatusCodes.NOT_FOUND).json({
        message: `${req.originalUrl} not found`
      });
    });

    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error('instance',error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }
  private async startServer(app: Application) {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startHttpServer(httpServer);
      // this.socketIOConnections(socketIO);
    } catch (error) {
      log.error(error);
      console.log(error);
    }
  }
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      }
    });
    const pubClient = createClient({ url: config.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }
  private startHttpServer(server: http.Server) {
    log.info(`server has started with process ${process.pid}`);
    server.listen(SERVER_PORT, () => {
      log.info(`server running on port ${SERVER_PORT}`);
    });
  }

  private socketIOConnection(io: Server) {}
}
// securityMiddleware
// standardMiddleware
// routesMiddleware
// globalErrorHandler
// startServer
// createSocketIO
// startHttpServer
