import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {Request} from 'express'
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersService } from './users.service';
import { QuoteService } from 'src/quotes/quotes.service';
import { QuoteUpdateDto } from 'src/quotes/dtos/quote-update.dto';

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

    @Post('myquote')
    async addQuote(
        @Body() body: QuoteUpdateDto,
        @Req() request: Request)
    {
        const user_id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id: user_id})
        return this.quoteService.create({
            quote: body.quote,
            user: user[0]
        })
    }

    @Put('myquote/:id')
    async update(@Param('id') id:number,
    @Body() body: QuoteUpdateDto,
    @Req() request: Request){
        
        const uid = await this.authService.userId(request);
        const quote = await this.quoteService.findOneRelations({id})
        
        if(uid === quote[0].user.id){
            await this.quoteService.update(id, body)
        }
        else{
            return({
                error: "Not your quote!"
            })
        }
        return this.quoteService.findOneRelations({id})
    }
}
