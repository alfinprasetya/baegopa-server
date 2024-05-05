import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  @InjectRepository(UsersEntity)
  private readonly usersRepository: Repository<UsersEntity>;

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    if (
      await this.usersRepository.findOne({
        where: { phone: createUserDto.phone },
      })
    ) {
      throw new BadRequestException('Phone already registered');
    }
    if (
      await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      })
    ) {
      throw new BadRequestException('Username already exists');
    }
    const newUser = this.usersRepository.create(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 10);

    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.usersRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
    return 'User deleted successfully';
  }
}
