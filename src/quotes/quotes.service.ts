import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import Quote from 'src/database/entity/quote.entity';
import { Repository } from 'typeorm';
import { RatingUpdateDto } from './dtos/rating-update.dto';

@Injectable()
export class QuoteService extends AbstractService {
    constructor(
        @InjectRepository(Quote) private readonly quoteRepository: Repository<Quote>
    ){
        super(quoteRepository)
    }

    
    async updateRating(id:number, data:RatingUpdateDto){
        return await super.update(id, {
            likes: data.likes,
            dislikes: data.dislikes
        })
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
