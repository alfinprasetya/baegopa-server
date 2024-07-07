import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MenusService } from './menus/menus.service';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const userService = app.get(UsersService);
  await userService.seedUser();

  const menuService = app.get(MenusService);
  await menuService.seedMenus();

  await app.listen(3000);
}
bootstrap();
