import { SignUp } from '@auth/controllers/signUp';
import Express, { Router } from 'express';

class AuthRoute{
    private router:Router;
    constructor(){
        this.router = Express.Router();
    }
    public routes(){
        this.router.post('/signup', SignUp.prototype.create);
        return this.router;
    }
}

export const authRoute = new AuthRoute();
