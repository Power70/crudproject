import {
    Controller, 
    Get, 
    UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
    
    // guards ensure that a certain conditon id made befor a user can be allowed
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() user: User){
        return user;
    }
}
