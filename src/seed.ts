import { INestApplication } from '@nestjs/common';
import { MenusService } from './menus/menus.service';
import { TransactionsService } from './transactions/services/transactions.service';
import { UsersService } from './users/users.service';

export default async function seedDB(app: INestApplication) {
  const userService = app.get(UsersService);
  await userService.seedUser();

  const menuService = app.get(MenusService);
  await menuService.seedMenus();

  const transactionService = app.get(TransactionsService);
  await transactionService.seedTransactions();
}
