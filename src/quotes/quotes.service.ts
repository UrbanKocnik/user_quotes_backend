import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import Quote from 'src/database/entity/quote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuoteService extends AbstractService {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository)
    }

    async randomQuote(){
        const q = await this.quoteRepository.query(`
        SELECT q.id
        FROM quotes q
        ORDER BY RANDOM()
        LIMIT 1;`)
        return q;
    }

    async paginate(page = 1, condition = "likes", relations: any[] = []): Promise<PaginatedResult>{
        const take = 1;
        const [data, total] = await this.repository.findAndCount({
            order:{
                [condition]: 'DESC'
            },
            take, 
            skip: (page - 1) * take, 
            relations
        });
        return {
            
            data: data,
            meta:{
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }
}
