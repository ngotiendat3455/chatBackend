import { Password } from '@auth/controllers/password';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { CustomError } from '@global/error-handlers';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import authService from '@service/db/auth.service';
import { emailQueue } from '@service/queues/email.queue';
import { Request, Response } from 'express';

const WRONG_EMAIL = 'test@email.com';
const CORRECT_EMAIL = 'manny@me.com';
const INVALID_EMAIL = 'test';
const CORRECT_PASSWORD = 'manny';

jest.mock('@service/queues/base.queue');
jest.mock('@service/queues/email.queue');
jest.mock('@service/emails/mail.transport');
jest.mock('@service/db/auth.service');

describe('Password', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('create', () => {
    it('should throw an error if email is invalid', () => {
        const req:Request = authMockRequest({}, { email: INVALID_EMAIL}) as Request;
        const res:Response = authMockResponse();
        Password.prototype.create(req, res).catch((error:CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toBe('Field must be valid');
        });
    });
    it('should throw "Invalid credentials" if email does not exist', () => {
        const req:Request = authMockRequest({}, { email: WRONG_EMAIL}) as Request;
        const res:Response = authMockResponse();
        jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(null as any);
        Password.prototype.create(req, res).catch((error:CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toBe('Invalid credentials');
        });
    });
    it('should send correct json response', async() => {
        const req:Request = authMockRequest({}, { email: CORRECT_EMAIL}) as Request;
        const res:Response = authMockResponse();
        jest.spyOn(authService, 'getAuthUserByEmail').mockResolvedValue(authMock);
        jest.spyOn(emailQueue, 'addEmailJob');  
        await Password.prototype.create(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password reset email sent.'
        });
        expect(emailQueue.addEmailJob).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('Password is a required field', () => {
        const req:Request = authMockRequest({}, { password: '', confirmPassword: ''}) as Request;
        const res:Response = authMockResponse();
        Password.prototype.update(req, res).catch((error:CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toBe('Password is a required field');
        });
    });

    it('should throw an error if password and confirmPassword are different', () => {
        const req:Request = authMockRequest({}, { password: '1234', confirmPassword: '5678'}) as Request;
        const res:Response = authMockResponse();
        Password.prototype.update(req, res).catch((error:CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toBe('Passwords should match');
        });
    });

    it('should throw error if reset token has expired', () => {
        const req:Request = authMockRequest({}, { password: '1234', confirmPassword: '1234'}, null,{
            token: 'sads'
        }) as Request;
        const res:Response = authMockResponse();
        jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(null as any);
        Password.prototype.update(req, res).catch((error:CustomError) => {
            console.log('error', error);
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Reset token has expired.');
        });
    });

    it('should send correct json response', async() => {
        const req:Request = authMockRequest({}, { password: '1234', confirmPassword: '1234'}, null,{
            token: '12sde3'
        }) as Request;
        const res:Response = authMockResponse();
        jest.spyOn(authService, 'getAuthUserByPasswordToken').mockResolvedValue(authMock);
        jest.spyOn(emailQueue, 'addEmailJob');
        try{
            await Password.prototype.update(req, res);
        }catch(eror:any){
            console.log(eror);
        }
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Password successfully updated.'
        });
        expect(emailQueue.addEmailJob).toHaveBeenCalled();
    });
  });
});
