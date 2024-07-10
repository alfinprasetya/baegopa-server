import { User } from 'src/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../utils/enum/transaction-type';
import { TransactionDetail } from './transaction-detail.entity';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  date: Date;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ default: false })
  completed: boolean;

  @OneToMany(() => TransactionDetail, (tDetail) => tDetail.transaction)
  items: TransactionDetail[];
}
