const express = require('express');
const { Transaction } = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// POST /api/transactions/ - Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, transaction_type, user } = req.body;

    if (!amount || !transaction_type || !user) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTransaction = await Transaction.create({
      amount,
      transaction_type,
      user,
    });

    return res.status(201).json({
      transaction_id: newTransaction.id,
      amount: newTransaction.amount,
      transaction_type: newTransaction.transaction_type,
      status: newTransaction.status,
      user: newTransaction.user,
      timestamp: newTransaction.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/?user_id=1 - Get transactions for a user
app.get('/api/transactions', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id in query' });
    }

    const transactions = await Transaction.findAll({ where: { user: user_id } });

    const formattedTransactions = transactions.map((tx) => ({
      transaction_id: tx.id,
      amount: tx.amount,
      transaction_type: tx.transaction_type,
      status: tx.status,
      timestamp: tx.timestamp,
    }));

    res.status(200).json({ transactions: formattedTransactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/transactions/:transaction_id - Update transaction status
app.put('/api/transactions/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { status } = req.body;

    if (!status || !['COMPLETED', 'FAILED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const transaction = await Transaction.findByPk(transaction_id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/transactions/:transaction_id - Get transaction by ID
app.get('/api/transactions/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;

    const transaction = await Transaction.findByPk(transaction_id);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.status(200).json({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
