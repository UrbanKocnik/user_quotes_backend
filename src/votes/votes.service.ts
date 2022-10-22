import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
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

    async createVote(data: VoteCreateDto, user: User, quote: Quote): Promise<Vote>
    {
        const newVote = {
            ...data,
            userId: user,
            quoteId: quote
          };
        return this.voteRepository.save(newVote);
    }
}
