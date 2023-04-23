import { ObjectId } from 'mongodb';
import mongoose, { Document } from 'mongoose';

export interface IMovieCategoryDocument extends Document {
  // _id?: string | mongoose.Types.ObjectId;
  name: string,
  code: string,
  description: string,
  createUserId: string,
  updateUserId: string,
  createdAt: Date,
  updateAt: Date,
  fee?:boolean
}

export interface IGetMovieCategoryQuery {
  _id?: ObjectId | string;
  name?: string;
  description?: string;
  code?: string;
}

export interface IQueryComplete {
  ok?: number;
  n?: number;
}

export interface IQueryDeleted {
  deletedCount?: number;
}
