import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, NotFoundException, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import {Request, Response} from 'express'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class AuthController {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private authService: AuthService
        ){}

    @Post('register')
    async register(@Body() body: RegisterDto){
        //checking if pw has typo
        if(body.password !== body.password_confirm){
            throw new BadRequestException('Passwords do not match');
        }
        //hashing pw
        const saltOrRounds = 12;
        const password = body.password;
        const hash = await bcrypt.hash(password, saltOrRounds);
        
        body.password = hash;
        //creating the user entry through user service method
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            image: "http://localhost:4000/api/me/uploads/default.png",
            password: hash,
        });
    }

    @Post('login')
    async login(
    @Body('email') email:string,
    @Body('password') password:string,
    //passthrough omogoca da dobima cookies iz frontenda in imam dostop do njih v backendu
    @Res({passthrough:true}) response: Response 
    ){
        //posle v service mail da najde pravega userja
        const user = await this.userService.findOneRelations({email});
        if(!user){
            throw new NotFoundException('user not found');
        }
        //preveri ce je poslan password enak shranjenemu passwordu userja
        if(!await bcrypt.compare(password, user[0].password)){
            throw new BadRequestException('password not match');
        }

        const jwt = await this.jwtService.signAsync({id: user[0].id})
 
        response.cookie('jwt', jwt, {httpOnly:true});
        return user;
    }
    
    @UseGuards(AuthGuard)
    @Get('user')
    async user(@Req() request: Request){
        const id = await this.authService.userId(request)
        
        const user = await this.userService.findOneRelations({id}) 
        return user;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Res({passthrough:true}) response:Response) {
        response.clearCookie('jwt');

        return {
            message: "succes"
        };
    }
}