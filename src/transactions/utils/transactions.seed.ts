import { TransactionType } from './enum/transaction-type';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const transactionTypes = [TransactionType.TAKEAWAY, TransactionType.DINE_IN];
const menuIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function generateRandomTransaction(userId: number) {
  const type = transactionTypes[getRandomInt(0, transactionTypes.length - 1)];
  const numberOfItems = getRandomInt(1, 10); // Number of items in the array
  const items = Array.from({ length: numberOfItems }, () => ({
    menu_id: menuIds[getRandomInt(0, menuIds.length - 1)],
    qty: getRandomInt(1, 3),
  }));

  return {
    user_id: userId,
    type: type,
    items: items,
  };
}
