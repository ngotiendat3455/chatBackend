import { emailQueue } from '@service/queues/email.queue';
import { BadRequestError } from '@global/error-handlers';
import authService from '@service/db/auth.service';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-decorator';
import { emailSchema, passwordSchema } from '@auth/schemas/password';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';
import publicIP from 'ip';
import moment from 'moment';
export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response) {
    const { email } = req.body;
    const exstingUser = await authService.getAuthUserByEmail(email);
    if (!exstingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
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

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response) {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (password !== confirmPassword) {
      throw new BadRequestError('Password do not match');
    }

    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired.');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const template = resetPasswordTemplate.passwordResetConfirmationTemplate({
      date: moment().format('DD//MM//YYYY HH:mm'),
      email: existingUser.email,
      username: existingUser.email,
      ipaddress: publicIP.address()
    });
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existingUser.email!, subject: 'Password Reset Confirmation' });
    res.status(HTTP_STATUS.OK).json({ message: 'Password successfully updated.' });
  }
}
