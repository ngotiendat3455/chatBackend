import dotenv from 'dotenv';
import bunyan from 'bunyan';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUD_NAME: string | undefined;
  public COLOUD_API: string| undefined;
  public CLOUD_SECRET: string | undefined;

  public SENDER_EMAIL: string | undefined;
  public SENDER_EMAIL_PASSWORD: string | undefined;
  public SENDGRID_API_KEY: string | undefined;
  public SENDGRID_SENDER: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || 'secret1';
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || 'secret2';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.DATABASE_URL = process.env.DATABASE_URL || '';
    this.NODE_ENV = process.env.NODE_ENV || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUD_NAME = process.env.CLOUD_NAME || '';
    this.COLOUD_API = process.env.COLOUD_API || '';
    this.CLOUD_SECRET = process.env.CLOUD_SECRET || '';
    this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
    this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
    this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
  }

  public cloudinaryConfig(){
    return cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.COLOUD_API,
      api_secret: this.CLOUD_SECRET
    });
  }
  public validateConfig() {
    for (const [k, v] of Object.entries(this)) {
      if (v === undefined) throw new Error(`Configuration ${k} is undifined`);
    }
  }
  public createLogger(name: string) {
    return bunyan.createLogger({ name, level: 'debug' });
  }
}

export const config: Config = new Config();
