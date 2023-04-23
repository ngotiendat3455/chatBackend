import { movieCategoryService } from '@service/db/movieCategory.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

export class Delete {
    public async post(req: Request, res: Response): Promise<void> {
      // await postCache.deletePostFromCache(req.params.postId, `${req.currentUser!.userId}`);
      // postQueue.addPostJob('deletePostFromDB', { keyOne: req.params.postId, keyTwo: req.currentUser!.userId });
      await movieCategoryService.deleteMovieCategory(req.params.movieCategoryId);
      res.status(HTTP_STATUS.OK).json({ message: 'Post deleted successfully' });
    }
  }
  