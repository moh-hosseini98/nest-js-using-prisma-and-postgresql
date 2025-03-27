import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUsertDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {

    @Post('register')
    registerUser(@Body() createUserDto : CreateUserDto): string {
        return "Register User"
    }

    @Post('login')
    loginUser(@Body() loginUserDto : LoginUserDto): string {
        return "Login User"
    }

    @Get('me')
    me(): string {
        return "Get Profile"
    }

    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe) id :number,
        @Body() updateUserDto: UpdateUsertDto
    ): string {
        return `Update user ${id}`
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): string {
        return `Delete User ${id}!`;
    }
  
}
