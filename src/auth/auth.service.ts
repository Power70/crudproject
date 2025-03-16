import { Injectable } from '@nestjs/common';
// This allow us to handle or write our business logic
// inject in into other files e.g controllers
@Injectable()
export class AuthService {
    signup(){
        return {message: 'I have sign up'}
    }
    
    signin(){
        return {message: 'I have sign in Yeaaaaaah'}
    }
}
