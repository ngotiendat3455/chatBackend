import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/schemas/user.chema';

// const log:Logger = config.createLogger('userService');
class UserService{
    async addUserToDb(data:IUserDocument){
        await UserModel.create(data);
    }
}

const userService = new UserService();

export default userService;
