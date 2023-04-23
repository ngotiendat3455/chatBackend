import { authMiddleware } from '@global/helpers/auth-middleware';
import Express, { Router } from 'express';
import { Get } from '../controllers/get-movies';
import { Create } from '../controllers/create-movie';
import { Update } from '../controllers/update-movie';
import { Delete } from '../controllers/delete-movie';

class MovieRoute{
    private router:Router;
    constructor(){
        this.router = Express.Router();
    }
    public routes(){
        this.router.get('/movie', authMiddleware.checkAuthentication, Get.prototype.movies);
        this.router.post('/movie', authMiddleware.checkAuthentication, Create.prototype.post);
        this.router.put('/movie/:movieId', authMiddleware.checkAuthentication, Update.prototype.movie);
        this.router.delete('/movie/:movieId', authMiddleware.checkAuthentication, Delete.prototype.post);
        return this.router;
    }
}

export const movieRoute = new MovieRoute();