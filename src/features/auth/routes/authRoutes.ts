// import { Password } from './../../../../../../chatty-backend-develop/src/features/auth/controllers/password';
// import { SignIn } from './../../../../../../chatty-backend-develop/src/features/auth/controllers/signin';
import { Password } from '@auth/controllers/password';
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
        this.router.post('/signin', SignIn.prototype.read);
        this.router.post('/forgot-password', Password.prototype.create);
        this.router.post('/reset-password/:token', Password.prototype.update);
        return this.router;
    }
}

export const authRoute = new AuthRoute();
