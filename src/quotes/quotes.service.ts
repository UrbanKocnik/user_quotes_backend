import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import Quote from 'src/database/entity/quote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuoteService extends AbstractService {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository)
    }

    async sort(){
        const q = this.quoteRepository.query(`
        SELECT q.quote, q.likes, q.dislikes, u.first_name, u.last_name
        FROM quotes q
        JOIN users u on q.user_id = u.id
        ORDER BY likes DESC;`)
        return q;
    }

    async randomQuote(){
        const q = this.quoteRepository.query(`
        SELECT q.quote, q.likes, q.dislikes, u.first_name, u.last_name
        FROM quotes q
        JOIN users u on q.user_id = u.id
        ORDER BY RANDOM()
        LIMIT 1;`)
        return q;
    }
}
