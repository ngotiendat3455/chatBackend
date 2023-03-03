import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
declare global {
    namespace Express{
        interface Request {
            currentUser?:IAuthPayload
        }
    }
}
export interface IAuthPayload {
    userId: string,
    uId: string,
    email: string,
    username: string,
    password?: string;
    avatarColor: string,
    iat?: string,
}

export interface IAuthDocument extends Document {
    _id: string | ObjectId;
    uId: string;
    username: string;
    email: string;
    password?: string;
    avatarColor: string;
    createdAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: number | string;
    comparePassword(password: string): Promise<boolean>;
    hashPassword(password: string): Promise<string>;
  }

  export interface ISignUpData {
    _id: string | ObjectId;
    uId: string;
    email: string;
    username: string;
    password: string;
    avatarColor: string;
    avatarImage: string;
  }
export interface IAuthJob {
    value?: string | IAuthDocument
}
