import mongoose from 'mongoose';
import { config } from '@root/config';
import { redisConnection } from '@service/redis/redis.connection';

const log = config.createLogger('database');
export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL || '')
      .then(() => {
        log.info('connect databases successfully');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('error connect db', error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnect', connect);
};
