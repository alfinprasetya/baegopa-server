import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  Min,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { TransactionType } from '../utils/enum/transaction-type';

class ItemDto {
  @IsInt()
  @IsNotEmpty()
  menu_id: number;

  @IsInt()
  @Min(1)
  qty: number;
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}
