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

    async findVotes(user: User){
        const q = await this.voteRepository.query(`
        SELECT *
        FROM votes v
        WHERE v.user_id = ${user.id}
        `)
        return q;
    }

    async createVote(data: VoteCreateDto, user: User, quote: Quote): Promise<Vote>
    {
        const vote = new Vote();
        vote.user = user;
        vote.quote = quote;
        vote.rating = data.rating
        return this.voteRepository.save(vote);
    }
}
