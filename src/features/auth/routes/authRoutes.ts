// import { SignIn } from './../../../../../../chatty-backend-develop/src/features/auth/controllers/signin';
import { SignIn } from '@auth/controllers/signIn';
import { SignUp } from '@auth/controllers/signUp';
import Express, { Router } from 'express';

class AuthRoute{
    private router:Router;
    constructor(){
        this.router = Express.Router();
    }
    public routes(){
        this.router.post('/signup', SignUp.prototype.create);
        this.router.get('/signin', SignIn.prototype.read);
        return this.router;
    }
}

export const authRoute = new AuthRoute();
