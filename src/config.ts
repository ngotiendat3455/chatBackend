import dotenv from 'dotenv';
import bunyan from 'bunyan';

dotenv.config({});

class Config {
    public DATABASE_URL: string | undefined;
    public JWT_TOKEN: string | undefined;
    public SECRET_KEY_ONE: string | undefined;
    public SECRET_KEY_TWO: string | undefined;
    public CLIENT_URL: string | undefined;
    public NODE_ENV: string | undefined;
    public REDIS_HOST: string | undefined;

    constructor(){
        this.DATABASE_URL = process.env.DATABASE_URL || '';
        this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || 'secret1';
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || 'secret2';
        this.CLIENT_URL = process.env.CLIENT_URL || '';
        this.DATABASE_URL = process.env.DATABASE_URL || '';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
    }

    public validateConfig(){
        for(const [k, v] of Object.entries(this)){
            if(v === undefined) throw new Error(`Configuration ${k} is undifined`);
        }
    }
    public createLogger(name: string){
        return bunyan.createLogger({name, level: 'debug'});
    }
}

export const config: Config = new Config();
