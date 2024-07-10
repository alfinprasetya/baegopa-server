import { Injectable } from '@nestjs/common';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TransactionDetailsService {
  @InjectRepository(TransactionDetail)
  private readonly repo: Repository<TransactionDetail>;

  create(req: TransactionDetail) {
    const transactionDetail = this.repo.create(req);
    return this.repo.save(transactionDetail);
  }
}
