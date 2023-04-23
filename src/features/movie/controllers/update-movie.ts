import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-decorator';
import { movieSchema } from '../schemas/movie.schema';
import { IMovieDocument } from '../interfaces/movie.interface';
import { movieService } from '@service/db/movie.service';

export class Update {
  // @joiValidation(movieSchema)
  public async movie(req: Request, res: Response): Promise<void> {
    const { movieName, movieDescription, movieTrailer, movieCens, movieGenres, movieRelease, movieLenght, movieFormat} = req.body;
    const { movieId } = req.params;
    // const postObjectId: ObjectId = new ObjectId();
    const createdPost: IMovieDocument = {
        movieName,
        movieDescription,
        movieTrailer,
        movieCens,
        movieGenres,
        movieRelease,
        movieLenght,
        movieFormat,
        updatedAt: new Date(),
    } as IMovieDocument;
    await movieService.editMovie(movieId, createdPost);
    res.status(HTTP_STATUS.CREATED).json({ message: 'Movie updated successfully' });
  }
}
