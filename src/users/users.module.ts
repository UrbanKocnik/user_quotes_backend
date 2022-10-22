import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import User from 'src/database/entity/user.entity';
import { QuotesModule } from 'src/quotes/quotes.module';
import Vote from 'src/database/entity/votes.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    CommonModule,
    AuthModule,
    QuotesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
