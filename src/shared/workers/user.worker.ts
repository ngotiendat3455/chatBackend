// import { IUserJob } from './../../features/user/interfaces/user.interface';
import { config } from '@root/config';
import { IUserJob } from '@user/interfaces/user.interface';
import Logger from 'bunyan';
import { Job, DoneCallback } from 'bull';
import { UserModel } from '@user/schemas/user.chema';
import userService from '@service/db/user.service';
const log: Logger = config.createLogger('userWorker');

class UserWorker {
  async addUserToDB(job: Job, done: DoneCallback) {
    try {
      const { value } = job.data;
      // await UserModel.create(value)
      await userService.addUserToDb(value);
      job.progress(1000);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

const userWorker = new UserWorker();
export default userWorker;
