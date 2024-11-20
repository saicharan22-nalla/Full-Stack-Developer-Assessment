const Transaction = require('../models/transaction');

exports.createTransaction = async (req, res) => {
  const { amount, transaction_type, user_id } = req.body;
  try {
    const transaction = await Transaction.create({ amount, transaction_type, user_id, status: 'PENDING' });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  const { user_id } = req.query;
  try {
    const transactions = await Transaction.findAll({ where: { user_id } });
    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    transaction.status = status;
    await transaction.save();
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
