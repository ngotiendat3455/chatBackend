import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

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
  movieType: 0 | 1 | 2,
  createdAt: Date,
  updatedAt: Date
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
  movieType?: string;
  movieCens?: string;
  movieRelease: string
}

export interface IMovieJobData {
  key?: string;
  value?: IMovieDocument;
  keyOne?: string;
  keyTwo?: string;
}