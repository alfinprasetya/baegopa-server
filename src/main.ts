import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MenusService } from './menus/menus.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const menuService = app.get(MenusService);
  await menuService.seedMenus();

  await app.listen(3000);
}
bootstrap();
