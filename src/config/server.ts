import path from 'path';
import express, { Express, Response, Request, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import http from 'http';
import nconf from 'nconf';
import getPort from 'get-port';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { mongoConnect } from '@config/database';
import { IndexRoute } from '@routes/.';
import { ServerError, ServerMessageHandler } from '@interfaces/server';
import { logger } from 'src/logger';

export class Server {
  private readonly _app: Express;

  constructor(private handler: ServerMessageHandler) {
    this._app = express();
  }

  async start() {
    const port = nconf.get('PORT') as number || await getPort({
      port: [3000, 3001, 3002]
    });
    const server = http.createServer(this._app);
    server.listen(port, () => {
      logger.info(`[SERVER] Listening on port "${port}"`);
      this.load()
        .then(() =>
          this.handler(null, `[SERVER] Server connected in: http://localhost:${port}`)
        ).catch(error =>
          this.handler(error, null)
        );
    });
  }

  private async load() {
    this.config();
    this.publicDirectory();
    await mongoConnect();
    this.routes();
  }

  private config() {
    this._app.use(cookieParser());
    this._app.use(morgan('common'));
    this._app.use(helmet());
    this._app.use(compression());
    this._app.use(cors());
    this._app.use(bodyParser.urlencoded({ extended: true }));
    this._app.use(bodyParser.json({ type: '*/*' }));
  }

  private routes() {
    const indexRoutes = new IndexRoute();
    this._app.use('/api', indexRoutes.router);
  }

  private publicDirectory() {
    const publicDirectory = path.resolve(__dirname, './../../public');
    this._app.use(express.static(publicDirectory));
    this._app.use((error: ServerError, _request: Request, response: Response, next: NextFunction) => {
      response.status(error.status || 500)
        .json({
          message: error.message,
          error: nconf.get('NODE_ENV') === 'development' ? error : {}
        });
      next(error);
    });
    logger.info('[SERVER] Public directory initialized');
  }
}
