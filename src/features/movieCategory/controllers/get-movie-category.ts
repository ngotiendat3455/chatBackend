import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IMovieCategoryDocument } from '../interfaces/movieCategory.interface';
import { movieCategoryService } from '@service/db/movieCategory.service';


export class Get {
    public async posts(req: Request, res: Response): Promise<void> {
      const { page, pageSize = 20 } = req.body;
      console.log('req.params', req.params, req.body);
      const skip: number = (parseInt(page) - 1) * Number(pageSize);
      const limit: number = Number(pageSize) * parseInt(page);
      // const newSkip: number = skip === 0 ? skip : skip + 1;
      // let movieCategory: IMovieCategoryDocument[] = [];
      let totalPosts = 0;
      // const cachedPosts: IPostDocument[] = await postCache.getPostsFromCache('post', newSkip, limit);
      const movieCategory: IMovieCategoryDocument[]  = await movieCategoryService.getMovieCategory({}, skip, limit, { createdAt: -1 });
      totalPosts = await movieCategoryService.movieCategoryCount();
      res.status(HTTP_STATUS.OK).json({ data: movieCategory, totalCount: totalPosts });
    }
};