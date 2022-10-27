import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import Quote from 'src/database/entity/quote.entity';
import User from 'src/database/entity/user.entity';
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

    async paginateUsersQuotes(user: User, page = 1, condition = "likes", relations: any[] = [], base = 4): Promise<PaginatedResult>{

        const take = base * page;
        const [data, total] = await this.quoteRepository.findAndCount({
            order:{
                quote:{
                    [condition]: 'DESC'
                }
            },
            where:{
                user
            },
            take, 
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
