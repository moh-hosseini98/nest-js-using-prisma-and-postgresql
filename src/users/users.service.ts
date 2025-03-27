import { Injectable,ConflictException, HttpException,NotFoundException,UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/core/services/prisma.service';
import { hash,compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginResponse, UserPayload } from 'src/interfaces/users-login.interface';

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

    async loginUser(loginUserDto : LoginUserDto) : Promise<LoginResponse> {
        try {
            const user = await this.prisma.user.findUnique({
                where : {email : loginUserDto.email}
            })

            if (!user) {
                throw new NotFoundException('User not found');
            }
            if (!(await compare(loginUserDto.password, user.password))) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const payload: UserPayload = {
                // create payload for JWT
                sub: user.id, // sub is short for subject. It is the user id
                email: user.email,
                name: user.name,
            }

            return {
                // return access token
                access_token: await this.jwtService.signAsync(payload),
            }
        } catch(error) {
            throw new HttpException(error, 500);
        }

    }

    async updateUser() {

    }

    async deleteUser() {

    }
}
