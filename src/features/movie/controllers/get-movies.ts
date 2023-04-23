import HTTP_STATUS from 'http-status-codes';

import { Request, Response } from 'express';
import { IMovieDocument } from '../interfaces/movie.interface';
import { movieService } from '@service/db/movie.service';

export class Get {
    public async movies(req: Request, res: Response): Promise<void> {
        const { page, pageSize, query } = req.body;
        const skip: number = (parseInt(page) - 1) * pageSize;
        const limit: number = pageSize * parseInt(page);
        // const newSkip: number = skip === 0 ? skip : skip + 1;
        let movies: IMovieDocument[] = [];
        let totalMovies = 0;
        //   const cachedPosts: IMovieDocument[] = await postCache.getPostsFromCache('post', newSkip, limit);
        //   if (cachedPosts.length) {
        //     posts = cachedPosts;
        //     totalPosts = await postCache.getTotalPostsInCache();
        //   } else {
        // posts = await postService.getPosts({}, skip, limit, { createdAt: -1 });
        // totalPosts = await postService.postsCount();
        //   }
        movies = await movieService.getMovies(query || {}, skip, limit, { createdAt: -1 });
        totalMovies = await movieService.moviesCount();
        res.status(HTTP_STATUS.OK).json({ message: 'All posts', data:movies, totalCount:totalMovies });
    }
}