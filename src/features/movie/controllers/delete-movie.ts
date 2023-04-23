
import { movieService } from '@service/db/movie.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Delete {
    public async post(req: Request, res: Response): Promise<void> {
      // await postCache.deletePostFromCache(req.params.postId, `${req.currentUser!.userId}`);
      // postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser!.userId });
      await movieService.deleteMovie(req.params.movieId, `${req.currentUser!.userId}`);
      res.status(HTTP_STATUS.OK).json({ message: 'Movie deleted successfully' });
    }
  }
  