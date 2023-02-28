import mongoose from 'mongoose';
import { config } from '@root/config';

const log = config.createLogger('database');
export default () => {
  const connect = () => {
    mongoose
      .connect('mongodb+srv://superadmin:superadmin@nodeexpressprojects.st1t5vh.mongodb.net/chatApp?retryWrites=true&w=majority')
      .then(() => {
        log.info('connect databases successfully');
      })
      .catch((error) => {
        log.error('error connect db', error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnect', connect);
};
