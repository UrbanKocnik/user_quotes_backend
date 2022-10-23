import { ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { VotesService } from 'src/votes/votes.service';
import { QuoteService } from './quotes.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('quotes')
export class QuotesController {
    constructor(
        private quoteService: QuoteService,
        private voteService: VotesService,
        private userService: UsersService,
        private authService: AuthService){}

    @Get('random')
    async random(){
        return this.quoteService.randomQuote()
    }

    @UseGuards(AuthGuard)
    @Post(':id/upvote')
    async upvote(
        @Req() request: Request,
        @Param('id') quote_id:number
    ){
        // get current user and rated quote data
        const id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id})
        const quote = await this.quoteService.findOneRelations({id: quote_id}, ['user']);

        //check if this is users quote
        if(user[0].id === quote[0].user.id){
            return ({
                error: "Cannot rate your own quote."
            })
        }

        //searches if the user already rated this quote
        const prev_rating = await this.voteService.findRatings(quote[0], user[0])        
        
        //if the user hasnt rate the quote yet we create an entry
        if(prev_rating.length == 0){

            return await this.voteService.createVote({
                rating: true
            }, user[0], quote[0]);
        }
        else{
            //if the user has rate the quote we check the rating
            if(!prev_rating[0].rating){
                await this.voteService.update(prev_rating[0].id,{
                    rating: true
                })        
                return await this.voteService.findRatings(quote[0], user[0])
            }
            else{
                return ({message: "Already liked"})
            }
        }

    }

    @UseGuards(AuthGuard)
    @Post(':id/downvote')
    async downvote(
        @Req() request: Request,
        @Param('id') quote_id:number
    ){
        // get current user and rated quote data
        const id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id})
        const quote = await this.quoteService.findOneRelations({id: quote_id}, ['user']);

        //check if this is users quote
        if(user[0].id === quote[0].user.id){
            return ({
                error: "Cannot rate your own quote."
            })
        }

        //searches if the user already rated this quote
        const prev_rating = await this.voteService.findRatings(quote[0], user[0])
        
        
        //if the user hasnt rate the quote yet we create an entry
        if(prev_rating.length == 0){

            return await this.voteService.createVote({
                rating: false
            }, user[0], quote[0]);
        }
        else{
            //if the user has rate the quote we check the rating
            if(prev_rating[0].rating){

                await this.voteService.update(prev_rating[0].id,{
                    rating: false
                })     
                return await this.voteService.findRatings(quote[0], user[0])    
            }
            else{
                return ({message: "Already disliked"})
            }
        }

    }


    @Get(':id')
    async get(@Param('id') id:number){
        return this.quoteService.findOneRelations({id}, ['votes', 'user'])
    }

    @Get()
    async all(
        @Query('page') page = 1,
        @Query('condition') condition = "likes"
    ){
        return await this.quoteService.paginate(page, condition, ['votes', 'user']);
    }

}
