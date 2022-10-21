import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import Quote from 'src/database/entity/quote.entity';
import { QuoteService } from './quotes.service';

@Module({
  providers: [QuoteService],
  imports: [
    TypeOrmModule.forFeature([Quote]),
    CommonModule,
    AuthModule
  ],
  exports:[QuoteService]
})
export class QuotesModule {}
