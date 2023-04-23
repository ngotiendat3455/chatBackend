import { joiValidation } from '@global/decorators/joi-decorator';
import { Request, Response } from 'express';
import { movieSchema } from '../schemas/movie.schema';
import { ObjectId } from 'mongodb';
import { IMovieDocument } from '../interfaces/movie.interface';
import HTTP_STATUS from 'http-status-codes';
import { movieQueue } from '@service/queues/movie.queue';
/**
 *  movieName:string
  movieDescription:string
  movieTrailer:string
  movieCens: string
  movieGenres: string
  movieRelease: string
  movieLenght: string
  movieFormat: string
  moviePoster: string,
  movieType: 0 | 1 | 2,
 */
export class Create {
  @joiValidation(movieSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { moviePoster, movieName, movieDescription, movieTrailer, movieCens, movieGenres, movieRelease, movieLenght, movieFormat, movieCategoryId, movieCategoryName } =
      req.body;
    // const postObjectId: ObjectId = new ObjectId();
    const createdPost: IMovieDocument = {
      // _id: postObjectId,
      userId: req.currentUser!.userId,
      username: req.currentUser!.username,
      email: req.currentUser!.email,
      avatarColor: req.currentUser!.avatarColor,
      movieName,
      movieDescription,
      movieTrailer,
      movieCens,
      movieGenres,
      movieRelease,
      movieLenght,
      movieFormat,
      movieCategoryId,
      movieCategoryName,
      createdAt: new Date(),
      updatedAt: new Date(),
      commentsCount: 0,
      reactions: { like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0 },
      moviePoster,
    } as IMovieDocument;
    movieQueue.addPostJob('saveMovieToDB', {
      key: req.currentUser!.userId,
      value: createdPost
    });
    res.status(HTTP_STATUS.CREATED).json({ message: 'Movie created successfully' });
  }
}
