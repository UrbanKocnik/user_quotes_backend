import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

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

    async paginate(page = 1, condition = "likes", relations: any[] = [], base = 9): Promise<PaginatedResult>{

        const take = base * page;
        const [data, total] = await this.repository.findAndCount({
            order:{
                [condition]: 'DESC'
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
