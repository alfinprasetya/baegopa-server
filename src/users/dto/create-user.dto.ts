import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsNumberString()
  @MinLength(11)
  @MaxLength(13)
  phone: string;

  @IsString()
  @MaxLength(20)
  @MinLength(6)
  password: string;
}
