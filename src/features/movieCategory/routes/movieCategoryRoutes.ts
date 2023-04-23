import { Delete } from './../controllers/delete-movie-category';
import { authMiddleware } from '@global/helpers/auth-middleware';
import Express, { Router } from 'express';
import { Get } from '../controllers/get-movie-category';
import { Create } from '../controllers/create-movie-category';
import { Update } from '../controllers/update-movie-category';

class MovieCategoryRoute {
    private router:Router;
    constructor(){
        this.router = Express.Router();
    }
    public routes(){
        this.router.get('/movieCategory/all', authMiddleware.checkAuthentication, Get.prototype.posts);
        this.router.post('/movieCategory', authMiddleware.checkAuthentication, Create.prototype.post);
        this.router.put('/movieCategory/:movieCategoryId', authMiddleware.checkAuthentication, Update.prototype.post);
        this.router.delete('/movieCategory/:movieCategoryId', authMiddleware.checkAuthentication, Delete.prototype.post);
        return this.router;
    }
}

export const movieCategoryRoutes = new MovieCategoryRoute();