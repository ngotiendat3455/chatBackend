
import { IMovieJobData } from '@root/features/movie/interfaces/movie.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { movieWorker } from '@worker/movie.worker';

class MovieQueue extends BaseQueue {
  constructor() {
    super('movies');
    this.processJob('saveMovieToDB', 5, movieWorker.saveMovieToDB);
    this.processJob('deleteMovieFromDB', 5, movieWorker.deleteMovieFromDB);
    this.processJob('updateMovieInDB', 5, movieWorker.updateMovieInDB);
  }

  public addPostJob(name: string, data: IMovieJobData): void {
    this.addJob(name, data);
  }
}

export const movieQueue: MovieQueue = new MovieQueue();
