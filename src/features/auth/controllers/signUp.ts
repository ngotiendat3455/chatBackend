import { JWT } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { IAuthDocument, IAuthPayload, ISignUpData } from '@auth/interfaces/auth.interface';
import { signupSchema } from '@auth/schemas/siginup';
import { joiValidation } from '@global/decorators/joi-decorator';
import { BadRequestError } from '@global/error-handlers';
import { Helpers } from '@global/helpers/helpers';
import AuthService from '@service/db/auth.service';
import { Request, Response } from 'express';
import { uploads } from '@global/cloudinary-upload';
import { StatusCodes } from 'http-status-codes';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';
import userQueue from '@service/queues/user.queue';
import { authQueue } from '@service/queues/auth.queue';
import { config } from '@root/config';
const userCache: UserCache = new UserCache();
export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage }: ISignUpData = req.body;
    const foundUsernameOrEmail = await AuthService.getUserByUsernameOrEmail(username, email);
    if (foundUsernameOrEmail) {
      throw new BadRequestError('Invalid credentials');
    }
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();

    const authData: IAuthDocument = SignUp.prototype.signUpData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor,
      avatarImage
    });
    const result = await uploads(avatarImage, `${authObjectId}`, true, true);
    if (!result?.public_id) {
      throw new BadRequestError('File Upload: Error occurred. Try again');
    }
    // Add to redis cache
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/dyamr9ym3/image/upload/v${result.version}/${userObjectId}`;
    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);
    authQueue.addAuthUserJob('addAuthUserToDB', {
      value: authData
    });
    userQueue.addUserJobToDB('addUserToDb', {
      value: userDataForCache
    });
    const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
    req.session = { jwt: userJwt };
    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      authData,
      token: userJwt
    });
  }
  private signUpData(data: ISignUpData): IAuthDocument {
    return {
      _id: data._id,
      uId: data.uId,
      email: data.email,
      username: data.username,
      password: data.password,
      avatarColor: data.avatarColor
    } as IAuthDocument;
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }
  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
