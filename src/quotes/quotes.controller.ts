import { ClassSerializerInterceptor, Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { QuoteService } from './quotes.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('quotes')
export class QuotesController {
    constructor(
        private quoteService: QuoteService){}

    @Get('random')
    async random(){
        return this.quoteService.randomQuote()
    }

    @Get(':id')
    async get(@Param('id') id:number){
        return this.quoteService.findOneRelations({id}, ['user'])
    }

    @Get()
    async all(
        @Query('page') page = 1,
        @Query('condition') condition = "likes"
    ){
        return await this.quoteService.paginate(page, condition, ['user']);
    }


}
