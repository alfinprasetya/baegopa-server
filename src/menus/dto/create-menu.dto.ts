import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { MenuCategory } from '../utils/enum/menu.category';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsEnum(MenuCategory)
  @IsNotEmpty()
  category: MenuCategory;
}
