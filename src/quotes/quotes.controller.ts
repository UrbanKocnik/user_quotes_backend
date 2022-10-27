import { ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
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

    @Get('random/rating/:id')
    async randomRating(
        @Req() request: Request,
        @Param('id') quote_id:number
    ){
        const id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id})
        const quote = await this.quoteService.findOneRelations({id: quote_id})
        return await this.voteService.findRatings(quote[0], user[0])
    }

    @Get('random')
    async random(){
        const quote = await this.quoteService.randomQuote()
        return await this.quoteService.findOneRelations({id: quote[0].id}, ['user', 'votes'])
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
        let quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);

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

            await this.voteService.createVote({
                rating: true
            }, user[0], quote[0]);

            quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);
            const likes = quote[0].upvotes
            const dislikes = quote[0].downvotes
            const rating = likes - dislikes

            await this.quoteService.updateRating(quote_id, {likes, dislikes, rating})
            return await this.quoteService.findOneRelations({id: quote[0].id}, ['user', 'votes']) 
        }
        else{
            //if the user has rate the quote we check the rating
            if(!prev_rating[0].rating){
                await this.voteService.update(prev_rating[0].id,{
                    rating: true
                })        

                quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);
                const likes = quote[0].upvotes
                const dislikes = quote[0].downvotes
                const rating = likes - dislikes

                await this.quoteService.updateRating(quote_id, {likes, dislikes, rating})
                return await this.quoteService.findOneRelations({id: quote[0].id}, ['user', 'votes'])  
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
        let quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);

        //check if this is users quote
        if(user[0].id === quote[0].user.id){
            return ({
                error: "Cannot rate your own quote."
            })
        }

        //searches if the user already rated this quote
        const prev_rating = await this.voteService.findRatings(quote[0], user[0])
        
        if(prev_rating.length == 0){

            await this.voteService.createVote({
                rating: false
            }, user[0], quote[0]);

            quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);
            const likes = quote[0].upvotes
            const dislikes = quote[0].downvotes
            const rating = likes - dislikes

            await this.quoteService.updateRating(quote_id, {likes, dislikes, rating})
            return await this.quoteService.findOneRelations({id: quote[0].id}, ['user', 'votes']) 

        }
        else{
            //if the user has rate the quote we check the rating
            if(prev_rating[0].rating){

                await this.voteService.update(prev_rating[0].id,{
                    rating: false
                })     

                quote = await this.quoteService.findOneRelations({id: quote_id}, ['user', 'votes']);
                const likes = quote[0].upvotes
                const dislikes = quote[0].downvotes
                const rating = likes - dislikes

                await this.quoteService.updateRating(quote_id, {likes, dislikes, rating})

                return await this.quoteService.findOneRelations({id: quote[0].id}, ['user', 'votes'])    
            }
            else{
                return ({message: "Already disliked"})
            }
        }

    }

    @UseGuards(AuthGuard)
    @Get('votes')
    async allVotes(
        @Req() request: Request,
    ){
        const id = await this.authService.userId(request)
        const user = await this.userService.findOneRelations({id})
        return this.voteService.findVotes(user[0])
    }


    @Get(':id')
    async get(@Param('id') id:number){
        return this.quoteService.findOneRelations({id}, ['votes', 'user'])
    }


    @Get()
    async all(
        @Query('page') page = 1,
        @Query('condition') condition = "likes",
        @Query('base') base = 2
    ){
        return await this.quoteService.paginate(page, condition, ['votes', 'user'], base);
    }


}
