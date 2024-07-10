import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './utils/enum/users.role';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;

  async create(createUserDto: CreateUserDto): Promise<User> {
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

    return plainToInstance(User, await this.usersRepository.save(newUser));
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => plainToInstance(User, user));
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return plainToInstance(User, user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.usersRepository.update(id, updateUserDto);
    return plainToInstance(
      User,
      await this.usersRepository.findOne({ where: { id } }),
    );
  }

  async remove(id: number): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepository.delete(id);
    return 'User deleted successfully';
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async seedUser() {
    const admin = new CreateUserDto();
    admin.username = 'alfin';
    admin.password = '123456';
    admin.phone = '085859332868';

    try {
      const savedUser = await this.create(admin);
      savedUser.role = Role.ADMIN;
      this.usersRepository.update(savedUser.id, savedUser);
    } catch (error) {
      console.log(`Error seeding user: ${admin.username}`);
    }

    const user = new CreateUserDto();
    user.username = 'user';
    user.password = '123456';
    user.phone = '085555555555';

    try {
      await this.create(user);
    } catch (error) {
      console.log(`Error seeding user: ${admin.username}`);
    }

    console.log('User seeded successfully');
  }
}
