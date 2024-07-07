import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { menuList } from './utils/menu.data';

@Injectable()
export class MenusService {
  @InjectRepository(Menu)
  private readonly menuRepository: Repository<Menu>;

  async create(createMenuDto: CreateMenuDto) {
    const existMenu = await this.menuRepository.findOne({
      where: { name: createMenuDto.name },
    });

    if (existMenu) {
      throw new ConflictException('Menu already exist');
    }

    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  findAll() {
    return this.menuRepository.find();
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findOneBy({ id });
    if (!menu) {
      throw new NotFoundException('Menu not found');
    }
    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    await this.findOne(id);
    await this.menuRepository.update(id, updateMenuDto);
    return this.menuRepository.findOneBy({ id });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.menuRepository.delete(id);
    return 'Menu deleted successfully';
  }

  async seedMenus() {
    const menus = menuList;

    for (const menu of menus) {
      try {
        await this.create(menu);
      } catch (error) {
        console.error(`Error seeding menu: ${menu.name}`);
        continue;
      }
    }

    console.log('Menu seeded successfully');
  }
}
