import { Injectable,ConflictException, HttpException, } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma.service';
import { hash,compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}
    
    async registerUser(createUserDto: CreateUserDto): Promise<User> {
        try {
          // create new user using prisma client
          const newUser = await this.prisma.user.create({
            data: {
              email: createUserDto.email,
              password: await hash(createUserDto.password, 10), // hash user's password
              name: createUserDto.name,
            },
          });
      
          // remove password from response
          delete newUser.password;
      
          return newUser;
        } catch (error) {
          // check if email already registered and throw error
          if (error.code === 'P2002') {
            throw new ConflictException('Email already registered');
          }
      
          // throw error if any
          throw new HttpException(error, 500);
        }
      }

    async loginUser() {

    }

    async updateUser() {

    }

    async deleteUser() {

    }
}
