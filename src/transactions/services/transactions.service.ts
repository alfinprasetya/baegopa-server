import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { MenusService } from 'src/menus/menus.service';
import { TransactionDetailsService } from './transaction-details.service';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/users/entities/users.entity';
import generateRandomTransaction from '../utils/transactions.seed';
import { QueryTransactionDto } from '../dto/query-transaction.dto';

@Injectable()
export class TransactionsService {
  @InjectRepository(TransactionEntity)
  private readonly repo: Repository<TransactionEntity>;

  @Inject()
  private readonly usersService: UsersService;

  @Inject()
  private readonly menuService: MenusService;

  @Inject()
  private readonly tDetailService: TransactionDetailsService;

  async create(req: CreateTransactionDto) {
    const transaction = new TransactionEntity();
    transaction.user = await this.usersService.findOne(req.user_id);
    transaction.type = req.type;
    transaction.date = new Date();
    const savedTransaction = await this.repo.save(transaction);

    for (const item of req.items) {
      const detail = new TransactionDetail();
      detail.menu = await this.menuService.findOne(item.menu_id);
      detail.price = detail.menu.price;
      detail.qty = item.qty;
      detail.transaction = savedTransaction;

      await this.tDetailService.create(detail);
    }

    return await this.findOne(savedTransaction.id);
  }

  async findAll(query: QueryTransactionDto) {
    const user = query.user ? { id: query.user } : {};
    const page = query.page ? query.page : 1;
    const max = query.max ? query.max : 10;

    const transactions = await this.repo.find({
      where: { user: user },
      relations: { user: true, items: { menu: true } },
      take: max,
      skip: max * (page - 1),
    });

    transactions.map((t) => (t.user = plainToInstance(User, t.user)));

    return transactions;
  }

  async findOne(id: number) {
    const transaction = await this.repo.findOne({
      where: { id },
      relations: { user: true, items: { menu: true } },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction data not found');
    }

    transaction.user = plainToInstance(User, transaction.user);

    return transaction;
  }

  remove(id: number) {
    this.repo.delete({ id });
  }

  async seedTransactions() {
    const count = await this.repo.count();
    if (count >= 20) {
      return;
    }
    const user1 = Array.from({ length: 10 }, () =>
      generateRandomTransaction(1),
    );
    const user2 = Array.from({ length: 10 }, () =>
      generateRandomTransaction(2),
    );
    const transactions = user1.concat(user2);

    for (const t of transactions) {
      try {
        const trans = await this.create(t);
        await this.repo.update(trans.id, { completed: true });
      } catch (error) {
        continue;
      }
    }

    console.log('Transaction seeded successfully');
  }
}
