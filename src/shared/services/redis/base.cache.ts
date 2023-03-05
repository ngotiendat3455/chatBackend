import { config } from '@root/config';
import Logger from 'bunyan';
import { createClient } from 'redis';

export type RadisClient = ReturnType<typeof createClient>;

export abstract class BaseCache{
    client: RadisClient;
    log: Logger;
    constructor(clientName:string){
        this.client = createClient({
            url: config.REDIS_HOST
        });
        this.log= config.createLogger(clientName);
        this.cacheError();
    }
    private cacheError():void{
        this.client.on('error', (error)=>{
            this.log.error(error);
        });
    }
}
