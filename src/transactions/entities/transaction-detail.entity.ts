import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { Menu } from 'src/menus/entities/menu.entity';

@Entity('transaction_details')
export class TransactionDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TransactionEntity)
  transaction: TransactionEntity;

  @ManyToOne(() => Menu)
  menu: Menu;

  @Column()
  price: number;

  @Column()
  qty: number;
}
