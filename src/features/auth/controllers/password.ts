import { emailQueue } from '@service/queues/email.queue';
import { BadRequestError } from '@global/error-handlers';
import authService from '@service/db/auth.service';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';

export class Password{
    public async create(req:Request, res:Response){
        const { email } = req.body;
        const exstingUser = await authService.getAuthUserByEmail(email);
        if(!exstingUser){
            throw new BadRequestError('Invalid credentials');
        }
        const randomBytes:Buffer = await Promise.resolve(crypto.randomBytes(20));
        const randomCharacters: string = randomBytes.toString('hex');
        const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;

        await authService.updatePasswordToken(`${exstingUser._id!}`, randomCharacters, Date.now() * 60 * 60 * 1000);
        const template = forgotPasswordTemplate.passwordResetTemplate(exstingUser.username, resetLink);
        emailQueue.addEmailJob('forgotPasswordEmail', {
            receiverEmail: email,
            subject: 'Reset your password',
            template
        });
        res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent.' });
    }
}
