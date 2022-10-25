import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import Quote from 'src/database/entity/quote.entity';
import User from 'src/database/entity/user.entity';
import Vote from 'src/database/entity/votes.entity';
import { Repository } from 'typeorm';
import { VoteCreateDto } from './dtos/vote-create.dto';

@Injectable()
export class VotesService extends AbstractService {
    constructor(
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
    ){
        super(voteRepository)
    }

    async findRatings(quote: Quote, user: User){
        return this.voteRepository.find({
            where: {
                user: {
                    id: user.id
                },
                quote: {
                    id: quote.id
                }
            },
        })
    }

    async createVote(data: VoteCreateDto, user: User, quote: Quote): Promise<Vote>
    {
        const vote = new Vote();
        vote.user = user;
        vote.quote = quote;
        vote.rating = data.rating
        return this.voteRepository.save(vote);
    }

    async paginateLiked(user: User, page = 1, condition = "likes", relations: any[] = ['user', 'quote'], base = 4): Promise<PaginatedResult>{

        const take = base * page;
        console.log(base, page, take)
        const [data, total] = await this.repository.findAndCount({
            order:{
                quote:{
                    [condition]: 'DESC'
                }
            },
            where:{
                user,
                rating: true
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
