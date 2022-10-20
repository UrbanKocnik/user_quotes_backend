import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {Request} from 'express'
import { UserUpdateDto } from './dtos/user-update.dto';
import { UsersService } from './users.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    
    constructor(private userService: UsersService,
        private authService: AuthService){}

    @Get()
    async all(){
        return await this.userService.all();
    }
/*
    @Post()
    @HasPermissions('users')
    async create(@Body() body: UserCreateDto): Promise<User> {
        const hash = await bcrypt.hash("1234", 12);
        

        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hash,
            role: {id: body.role_id} //to define a foreign key it has to be an object
        });
    }*/

    @Get(':id')
    async get(@Param('id') id:number){
        return this.userService.findOneRelations({id})
    }

    @Delete(':id')
    async delete(@Param('id') id:number){
        return this.userService.delete(id);
    }
}
