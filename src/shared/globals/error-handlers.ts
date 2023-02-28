import { StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  serializeErrors(): IError;
}

export interface IError {
  status: string;
  statusCode: number;
  message: string;
}
export abstract class CustomError extends Error {
  abstract status: string;
  abstract statusCode: number;
  constructor(message?: string) {
    super(message);
  }
  serializeErrors(): IError {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message
    };
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'error';
  constructor(message?: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = 'error';
  constructor(message?: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  status = 'error';
  constructor(message?: string) {
    super(message);
  }
}
export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  status = 'error';
  constructor(message?: string) {
    super(message);
  }
}
