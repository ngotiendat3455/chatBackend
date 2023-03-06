import HTTP_STATUS from 'http-status-codes';
// import HTTP_STATUS from '@service/db/auth.service';
import { BadRequestError } from '@global/error-handlers';
import { Request, Response } from 'express';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import userService from '@service/db/user.service';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { loginSchema } from '@auth/schemas/signin';
import authService from '@service/db/auth.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { joiValidation } from '@global/decorators/joi-decorator';

export class SignIn{
    @joiValidation(loginSchema)
    public async read(req:Request, res:Response): Promise<void>{
        const { username, password } = req.body;
        const existingUser:IAuthDocument = await authService.getAuthUserByUsername(username);
        if(!existingUser){
            throw new BadRequestError('Invalid credentials');
        }
        const flagCheckpassword = await existingUser.comparePassword(password);
        if(!flagCheckpassword){
            throw new BadRequestError('Invalid credentials');
        }
        const user: IUserDocument = await userService.getUserByAuthId(`${existingUser.id}`);
        const userJwt: string = JWT.sign({
            userId: user._id,
            uId: existingUser.uId,
            email: existingUser.email,
            username: existingUser.username,
            avatarColor: existingUser.avatarColor
        },
            config.JWT_TOKEN!
        );
        req.session = {
            jwt: userJwt
        };
        res.status(HTTP_STATUS.OK).json({ message: 'User login successfully', user: user, token: userJwt });

    }
}
