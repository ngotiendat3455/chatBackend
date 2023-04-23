import mongoose, { Model, Schema, model } from 'mongoose';
import { IMovieDocument } from '../interfaces/movie.interface';

const movieSchema: Schema = new Schema({
  movieName: { type: String },
  movieDescription: { type: String },
  movieTrailer: { type: String },
  movieCens: { type: String },
  movieGenres: { type: String },
  movieRelease: { type: Date, default: Date.now },
  movieLenght: { type: String },
  movieFormat: { type: String },
  moviePoster: { type: String },
  movieType: { type: Number, default: 1},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  username: { type: String },
  email: { type: String },
  avatarColor: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MovieModel: Model<IMovieDocument> = model<IMovieDocument>('Movie', movieSchema, 'Movie');
export { MovieModel };
