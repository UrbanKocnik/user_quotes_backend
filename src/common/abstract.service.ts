import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class AbstractService {
    protected constructor(
        protected readonly repository: Repository<any>
    ){}

    async all(relations: any[] = []): Promise<any[]>{
        return await this.repository.find({relations});
    }

    async create(data): Promise<any>{
        
        return this.repository.save(data);
    }

    async findOneRelations(where, relations:any[] = []): Promise<any[]>{
        console.log(where)
        const relations1 = this.repository.find({
            where,
            relations
        })
        const perms = await relations1;
        return perms;       
    }

    async update(id: number, data): Promise<any>{
        return this.repository.update(id, data);
    }

    async delete(id: number):Promise<any>{
        return this.repository.delete(id);
    }
}
