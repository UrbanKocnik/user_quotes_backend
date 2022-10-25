import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import Quote from 'src/database/entity/quote.entity';
import { Repository, SimpleConsoleLogger } from 'typeorm';
import { RatingUpdateDto } from './dtos/rating-update.dto';

@Injectable()
export class QuoteService extends AbstractService {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository)
    }

    async updateRating(id: number, data: RatingUpdateDto){
        return this.quoteRepository.update(id, {
            likes: data.likes,
            dislikes: data.dislikes,
            rating: data.rating

        });
    }

    async randomQuote(){
        const q = await this.quoteRepository.query(`
        SELECT q.id
        FROM quotes q
        ORDER BY RANDOM()
        LIMIT 1;`)
        return q;
    }

}
