import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IReactions } from '@reaction/interfaces/reaction.interface';

export interface IMovieDocument extends Document {
  _id: string | ObjectId;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  movieName:string
  movieDescription:string
  movieTrailer:string
  movieCens: string
  movieGenres: string
  movieRelease: string
  movieLenght: string
  movieFormat: string
  moviePoster: string,
  movieCategoryId: string | ObjectId;
  movieCategoryName: string;
  createdAt: Date,
  updatedAt: Date,
  reactions?: IReactions;
  commentsCount: number;
}

export interface IQueryComplete {
  ok?: number;
  n?: number;
}

export interface IQueryDeleted {
  deletedCount?: number;
}
export interface IGetMoviesQuery {
  _id?: ObjectId | string;
  movieName?: string;
  movieGenres?: string;
  movieCategoryName?: string | ObjectId;
  movieCens?: string;
  movieRelease: string
}

export interface IMovieJobData {
  key?: string;
  value?: IMovieDocument;
  keyOne?: string;
  keyTwo?: string;
}