import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MenuCategory } from '../utils/enum/menu.category';

@Entity('menus')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  price: number;

  @Column({
    type: 'enum',
    enum: MenuCategory,
  })
  category: MenuCategory;

  @BeforeInsert()
  setImageUrl() {
    const imgName = this.name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
    this.imageUrl = `/images/${imgName}.jpg`;
  }
}
