import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import Quote from 'src/database/entity/quote.entity';
import { QuoteService } from './quotes.service';
import { QuotesController } from './quotes.controller';

@Module({
  providers: [QuoteService],
  imports: [
    TypeOrmModule.forFeature([Quote]),
    CommonModule,
    AuthModule
  ],
  exports:[QuoteService],
  controllers: [QuotesController]
})
export class QuotesModule {}
