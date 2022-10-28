import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {Request, Response} from 'express'
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



    @UseGuards(AuthGuard)
    @Get('liked')
    async liked(
        @Query('page') page = 1,
        @Req() request: Request,
    ){
        const id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id})
        return this.quoteService.paginateLiked(user[0], page)
    }

    @UseGuards(AuthGuard)
    @Get(':id/liked')
    async likedOfUser(
        @Query('page') page = 1,
        @Param('id') id:number,
    ){
        const user = await this.userService.findOneRelations({id})
        return this.quoteService.paginateLiked(user[0], page)
    }

    @Put('update-info')
    async updateInfo(
        @Body() body: UserUpdateDto,
        @Req() request: Request){

        if(body.email === '' && body.first_name === '' && body.last_name === ''){
            console.log('empty body')
            return
        }
        const id = await this.authService.userId(request);
        await this.userService.update(id, body)
        return this.userService.findOneRelations({id})
    }

    @Put('update-image')
    async updateImage(
        @Body() image: string,
        @Req() request: Request){

        const id = await this.authService.userId(request);
        await this.userService.update(id, image)
        return this.userService.findOneRelations({id})
    }

    @Put('update-password')
    async updatePassword(
        @Body('current_password') current_password: string,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string,
        @Req() request: Request){
        
        const id = await this.authService.userId(request);
        const user = await this.userService.findOneRelations({id})

        if(!await bcrypt.compare(current_password, user[0].password)){
            throw new BadRequestException('Wrong password. Cannot change without confirming your old password.');
        }
        if(password !== password_confirm){
            throw new BadRequestException('Passwords do not match');
        }
        const hash = await bcrypt.hash(password, 12);
        await this.userService.update(id, {
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            email: user[0].email,
            image: user[0].image,
            password: hash
        })
        return this.userService.findOneRelations({id})
    }

    @Get('usersquotes/:id')
    async getUserQuotes(
        @Query('page') page = 1,
        @Query('condition') condition = "likes",
        @Query('base') base = 4,
        @Param('id') id:number)
    {
        const user = await this.userService.findOneRelations({id})
        return this.quoteService.paginateUsersQuotes(user[0], page, condition, ['user'], base)
    }

    @Get('usersquotes')
    async getQuotes(
        @Req() request: Request,
        @Query('page') page = 1,
        @Query('condition') condition = "likes",
        @Query('base') base = 4)
    {
        const user_id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id: user_id})
        return this.quoteService.paginateUsersQuotes(user[0], page, condition, ['user'], base)
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
            likes: 0,
            dislikes: 0,
            rating: 0,
            user: user[0]
        })
    }

    @Put('myquote/:id')
    async update(
        @Param('id') id:number,
        @Body() body: QuoteUpdateDto,
        @Req() request: Request){
        
        const uid = await this.authService.userId(request);
        const quote = await this.quoteService.findOneRelations({id}, ['user'])
        
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

    @Delete('myquote/:id')
    async delete(
        @Param('id') id:number,
        @Req() request: Request){
        const uid = await this.authService.userId(request);
        const quote = await this.quoteService.findOneRelations({id}, ['user'])
        
        if(uid === quote[0].user.id){
            await this.quoteService.delete(id)
        }
        else{
            return({
                error: "Not your quote!"
            })
        }
    }

    @Get('user/:id')
    async user(@Param('id') id: number){
        return this.userService.findOneRelations({id}, ['votes', 'quotes'])
    }

    @Get()
    async me(@Req() request: Request){
        const id = await this.authService.userId(request);
        return this.userService.findOneRelations({id}, ['votes', 'quotes'])
    }
}
