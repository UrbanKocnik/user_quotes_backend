import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {Request} from 'express'
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersService } from './users.service';
import { QuoteService } from 'src/quotes/quotes.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('me')
export class UsersController {
    
    constructor(
        private userService: UsersService,
        private authService: AuthService,
        private quoteService: QuoteService){}

    @Get()
    async me(@Req() request: Request){
        const id = await this.authService.userId(request);
        return this.userService.findOneRelations({id})
    }

    @Get(':id')
    async get(@Param('id') id:number){
        return this.userService.findOneRelations({id})
    }

    @Put('update-info')
    async updateInfo(
        @Body() body: UserUpdateDto,
        @Req() request: Request){

        const id = await this.authService.userId(request);
        await this.userService.update(id, body)
        return this.userService.findOneRelations({id})
    }

    @Put('update-password')
    async updatePassword(
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string,
        @Req() request: Request){
        if(password !== password_confirm){
            throw new BadRequestException('Passwords do not match');
        }
        const id = await this.authService.userId(request);
        const hash = await bcrypt.hash(password, 12);
                   
        await this.userService.update(id, {
            password: hash
        })
        return this.userService.findOneRelations({id})
    }
}
