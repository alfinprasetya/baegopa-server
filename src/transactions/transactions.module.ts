import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionDetail } from './entities/transaction-detail.entity';
import { UsersModule } from '../users/users.module';
import { MenusModule } from 'src/menus/menus.module';
import { TransactionDetailsService } from './services/transaction-details.service';

@Module({
  imports: [
    UsersModule,
    MenusModule,
    TypeOrmModule.forFeature([TransactionEntity, TransactionDetail]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionDetailsService],
})
export class TransactionsModule {}
