import { BaseCache } from './base.cache';

class RedisConnection extends BaseCache{
    constructor(){
        super('redisConnection');
    }

    async connect(){
        try{
            await this.client.connect();
            const res = await this.client.ping();
            this.log.info('redis ping', res);
        }catch(error){
            this.log.error(error);
        }
    }
}

export const redisConnection = new RedisConnection();
