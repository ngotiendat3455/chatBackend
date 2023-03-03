import { authRoute } from '@auth/routes/authRoutes';
import { Application } from 'express';

const BASE_URL = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use(BASE_URL, authRoute.routes());
  };
  routes();
};
