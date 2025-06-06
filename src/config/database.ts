import nconf from 'nconf';
import { connect } from 'mongoose';
import { MONGO_CONFIG_KEY } from '@const/config';
import { MongoConfig } from '@interfaces/mongo';
import { logger } from 'src/logger';
import { getErrorMessage } from '@utils/error.util';

export const mongoConnect = async () => {
  const { url, database } = nconf.get(MONGO_CONFIG_KEY) as MongoConfig;
  try {
    const connected = await connect(url);
    logger.info(`[DB] Mongo "${database}" database connected...`);

    return connected.connection;
  } catch(error: any) {
    logger.error(`[DB] Cannot connect to the "${database}" database\n${getErrorMessage(error)}`);
  }

  return null;
}
