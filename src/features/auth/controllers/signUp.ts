import { IAuthDocument } from './../interfaces/auth.interface';
import { ObjectId } from 'mongodb';
import { IAuthPayload, ISignUpData } from '@auth/interfaces/auth.interface';
import { signupSchema } from '@auth/schemas/siginup';
import { joiValidation } from '@global/decorators/joi-decorator';
import { BadRequestError } from '@global/error-handlers';
import { Helpers } from '@global/helpers/helpers';
import AuthService from '@service/db/auth.service';
import { Request, Response } from 'express';
import { uploads } from '@global/cloudinary-upload';

export class SignUp {
    @joiValidation(signupSchema)
    public async create(req:Request, res: Response): Promise<void>{
        const {username, email, password, avatarColor, avatarImage }:ISignUpData = req.body;
        const foundUsernameOrEmail = await AuthService.getUserByUsernameOrEmail(username, email);
        if(foundUsernameOrEmail){
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
        if(!result?.public_id){
            throw new BadRequestError('File Upload: Error occurred. Try again');
        }
    }
    private signUpData(data: ISignUpData): IAuthDocument{
        return {
            _id: data._id,
            uId: data.uId,
            email: data.email,
            username: data.username,
            password: data.password,
            avatarColor: data.avatarColor
        } as IAuthDocument;
    }
}
