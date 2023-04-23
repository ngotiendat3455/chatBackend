import { authRoute } from '@auth/routes/authRoutes';
import { Application } from 'express';
import { movieCategoryRoutes } from './features/movieCategory/routes/movieCategoryRoutes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { movieRoute } from './features/movie/routes/movieRoutes';

const BASE_URL = '/api/v1';
export default (app: Application) => {
  const routes = () => {
    app.use(BASE_URL, authRoute.routes());
    app.use(BASE_URL, authMiddleware.verifyUser,movieCategoryRoutes.routes());
    app.use(BASE_URL, authMiddleware.verifyUser, movieRoute.routes());
  };
  routes();
};
