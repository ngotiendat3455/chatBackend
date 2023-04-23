import { Job, DoneCallback } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { movieService } from '@service/db/movie.service';

const log: Logger = config.createLogger('movietWorker');

class MovieWorker {
    async saveMovieToDB(job: Job, done: DoneCallback): Promise<void> {
        try {
          const { key, value } = job.data;
          await movieService.addMovieToDB(key, value);
          job.progress(100);
          done(null, job.data);
        } catch (error) {
          log.error(error);
          done(error as Error);
        }
      }
    
      async deleteMovieFromDB(job: Job, done: DoneCallback): Promise<void> {
        try {
          const { keyOne, keyTwo } = job.data;
          await movieService.deleteMovie(keyOne, keyTwo);
          job.progress(100);
          done(null, job.data);
        } catch (error) {
          log.error(error);
          done(error as Error);
        }
      }
    
      async updateMovieInDB(job: Job, done: DoneCallback): Promise<void> {
        try {
          const { key, value } = job.data;
          await movieService.editMovie(key, value);
          job.progress(100);
          done(null, job.data);
        } catch (error) {
          log.error(error);
          done(error as Error);
        }
      }
}

export const movieWorker: MovieWorker = new MovieWorker();