
import { IUserJob } from '@user/interfaces/user.interface';
import userWorker from '@worker/user.worker';
import { BaseQueue } from './base.queue';

class UserQueue extends BaseQueue{
    constructor(){
        super('userQueue');
        this.processJob('addUserToDb', 5, userWorker.addUserToDB);
    }

    public addUserJobToDB(name: string, data: IUserJob){
        this.addJob(name, data);
    }
}

const userQueue = new UserQueue();

export default userQueue;
