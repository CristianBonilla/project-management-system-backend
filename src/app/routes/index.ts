import { Router } from 'express';
import { logger } from 'src/logger';

export class IndexRoute {
  private readonly _prefixRoute = '/';
  private readonly _router: Router;

  get router() {
    return this._router;
  }

  constructor() {
    this._router = Router();
    this.routes();
  }

  private routes() {
    const route = this._router.route(this._prefixRoute);
    route.get((_request, response) => {
      response.status(200).send({
        message: '[API] Connected...'
      });
    });

    logger.info('[API] Routes are initialized');
  }
}
