import { IAuthJob } from '@auth/interfaces/auth.interface';
import { BullAdapter } from '@bull-board/express';
import { ExpressAdapter } from '@bull-board/express/dist/ExpressAdapter';
import { config } from '@root/config';
import { createBullBoard } from '@bull-board/api';
import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { IEmailJob, IUserJob } from '@user/interfaces/user.interface';
import { IMovieJobData } from '@root/features/movie/interfaces/movie.interface';

type IBaseJobData = IAuthJob | IUserJob | IEmailJob | IMovieJobData;

let bullAdapters: BullAdapter[] = [];
export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;
  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapters.push(new BullAdapter(this.queue));
    bullAdapters = [...new Set(bullAdapters)];
    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });
    this.log = config.createLogger(`${queueName}Queue`);
    // this.log = config.createLogger(`${queueName}Queue`);

    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job ${jobId} completed`);
    });

    this.queue.on('global:stalled', (jobId: string) => {
      this.log.info(`Job ${jobId} is stalled`);
    });
  }
  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 5000 } });
  }

  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
