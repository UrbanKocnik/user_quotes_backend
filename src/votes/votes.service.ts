import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import Vote from 'src/database/entity/votes.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VotesService extends AbstractService {
    constructor(
        @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>
    ){
        super(voteRepository)
    }
}
