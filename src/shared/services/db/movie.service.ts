import { IGetMoviesQuery, IMovieDocument, IQueryComplete, IQueryDeleted } from '@root/features/movie/interfaces/movie.interface';
import { MovieModel } from '@root/features/movie/models/movie.schema';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/schemas/user.chema';
import { Query, UpdateQuery } from 'mongoose';

class MovieService {
  public async addMovieToDB(userId: string, createMovie: IMovieDocument) {
    const post: Promise<IMovieDocument> = MovieModel.create(createMovie);
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne(
      {
        _id: userId
      },
      {
        $inc: {
          postsCount: 1
        }
      }
    );
    await Promise.all([post, user]);
  }
  public async getMovies(query: IGetMoviesQuery, skip = 0, limit = 0, sort: Record<string, 1 | -1>): Promise<IMovieDocument[]> {
    const movies: IMovieDocument[] = await MovieModel.aggregate([
      {
        $match: query
      },
      {
        $sort: sort
      },
      { $skip: skip },
      { $limit: limit }
    ]);
    return movies;
  }
  public async moviesCount():Promise<number>{
    const count = await MovieModel.find({}).countDocuments();
    return count;
  }
  public async deleteMovie(movieId: string, userId: string){
    const deleteMovie: Query<IQueryComplete & IQueryDeleted, IMovieDocument> = MovieModel.deleteOne({_id: movieId});
    const user: UpdateQuery<IUserDocument> = UserModel.updateOne(
        {
          _id: userId
        },
        {
          $inc: {
            postsCount: -1
          }
        }
      );
      await Promise.all([deleteMovie, user]);
  }
  public async editMovie(movieId: string, updateMovie: IMovieDocument):Promise<void>{
    const movie: UpdateQuery<IMovieDocument> = MovieModel.updateOne(
        {
          _id: movieId
        },
        {
          $set: updateMovie
        }
      );
    await Promise.all([movie]);
  }
}

export const movieService: MovieService = new MovieService();
