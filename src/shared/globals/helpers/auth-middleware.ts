import { IAuthPayload } from '@auth/interfaces/auth.interface';
import { NotAuthorizedError } from './../error-handlers';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';

export class AuthMiddleware{
    public verifyUser(req:Request, res:Response, next: NextFunction){
        console.log('req.session', req.session);
        // const { refreshToken, accessToken } = req.signedCookies;
        // console.log('refreshToken, accessToken', refreshToken, accessToken);
        // console.log('req.header(\'authorization\');', req.header('authorization'));
        const authHeader = req.header('authorization');
        if (authHeader?.startsWith('Bearer ')){
            const token = authHeader.substring(7, authHeader.length);
            try{
                const payload:IAuthPayload = JWT.verify(token, config.JWT_TOKEN!) as IAuthPayload;
                req.currentUser = payload;
            }catch(error){
                throw new NotAuthorizedError('Token is invalid. Please login again.');
            }
            next();
       } else {
          //Error
          throw new NotAuthorizedError('Token is not available. Please login again.');
       }
        // if(!req.session?.jwt){
        //     throw new NotAuthorizedError('Token is not available. Please login again.');
        // }

    }
    public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
        if (!req.currentUser) {
          throw new NotAuthorizedError('Authentication is required to access this route.');
        }
        next();
      }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
