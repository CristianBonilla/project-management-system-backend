import nconf from 'nconf';
import async from 'async';
import dotenv from 'dotenv';
import { Server } from '@config/server';
import { ServerMessageHandler } from '@interfaces/server';
import { getErrorMessage } from '@utils/error.util';
import { logger } from 'src/logger';

dotenv.config();

nconf.use('memory');
nconf.argv();
nconf.env();

require(`@env/${nconf.get('NODE_ENV')}`);

logger.info('[APP] Starting server initilization...');

async.series([
  (startServer: ServerMessageHandler) => {
    const server = new Server(startServer);
    server.start().finally(() => {});
  }
]).then(results => {
  results.forEach(logger.verbose);
  logger.info('[APP] initialized SUCCESSFULLY');
}).catch((error) =>
  logger.error(`[APP] initialization failed:\n${getErrorMessage(error)}`)
);
