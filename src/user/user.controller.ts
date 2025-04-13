import { Controller, Get, UseGuards, Req} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'

@Controller('users')
export class UserController {
    
    // guards ensure that a certain conditon id made befor a user can be allowed
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req: Request){
        return req.user;
    }
}
