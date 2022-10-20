import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import User from 'src/database/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly UserRepository: Repository<User>
    ){
        super(UserRepository)
    }
}
