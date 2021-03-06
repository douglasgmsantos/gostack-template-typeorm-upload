import { Router } from 'express';
import multer = require('multer');
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  var transactions = await repository.find();
  var balance = await repository.getBalance();

  return response.json({
    transactions,
    balance
  });
});

transactionsRouter.post('/', async (request, response) => {
  const {
    title, value, type, category
  } = request.body;

  const createTransactionService = new CreateTransactionService();
  var transaction = await createTransactionService.execute({ title, value, type, category })
  return response.json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService()
  await deleteTransaction.execute({ id });

  return response
    .status(204)
    .json()
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();
  var transactions = await importTransactionsService.execute({ filename: request.file.filename });
  return response.json(transactions)
});

export default transactionsRouter;
