import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return (
      'This action adds a new users with data: ' + Object.entries(createUserDto)
    );
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} users`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return (
      `This action updates a #${id} users with data: ` +
      Object.entries(updateUserDto)
    );
  }

  remove(id: number) {
    return `This action removes a #${id} users`;
  }
}
