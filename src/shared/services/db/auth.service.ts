import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/interfaces/auth.schema';
import { Helpers } from '@global/helpers/helpers';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        {
          username,
          email
        }
      ]
    };
    const user = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }
  public async createAuthUser(data: IAuthDocument) {
    await AuthModel.create(data);
  }
  public async getAuthUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.firstLetterUppercase(username) }).exec()) as IAuthDocument;
    return user;
  }
  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ email: Helpers.firstLetterUppercase(email) }).exec()) as IAuthDocument;
    return user;
  }
  public async updatePasswordToken(userId: string, passwordToken: string, passwordResetExpires: number) {
    await AuthModel.updateOne({ _id: userId }, { passwordResetToken: passwordToken, passwordResetExpires: passwordResetExpires });
  }
}

const authService = new AuthService();
export default authService;
