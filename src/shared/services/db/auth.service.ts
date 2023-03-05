import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/interfaces/auth.schema';

class AuthService {
    public async getUserByUsernameOrEmail(username:string, email:string):Promise<IAuthDocument>{
        const query ={
            $or: [
                {
                    username,
                    email
                }
            ]
        };
        const user = await AuthModel.findOne(query).exec() as IAuthDocument;
        return user;
    }
    public async createAuthUser(data:IAuthDocument){
        await AuthModel.create(data);
    }
}

const authService = new AuthService();
export default authService;
