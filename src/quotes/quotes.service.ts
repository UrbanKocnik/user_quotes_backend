import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import Quote from 'src/database/entity/quote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuoteService extends AbstractService {
    constructor(
        @InjectRepository(Quote) private readonly QuoteRepository: Repository<Quote>
    ){
        super(QuoteRepository)
    }
}
