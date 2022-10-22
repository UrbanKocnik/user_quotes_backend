import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import Quote from 'src/database/entity/quote.entity';
import { QuoteService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import Vote from 'src/database/entity/votes.entity';
import { VotesModule } from 'src/votes/votes.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [QuoteService],
  imports: [
    TypeOrmModule.forFeature([Quote]),
    forwardRef(()=>UsersModule),
    CommonModule,
    AuthModule,
    VotesModule
  ],
  exports:[QuoteService],
  controllers: [QuotesController]
})
export class QuotesModule {}
