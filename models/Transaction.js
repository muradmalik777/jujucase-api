const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let TransactionSchema = new Schema({

    steam_id: String,
    amount: mongoose.Decimal128,
    description: String,
    time: Number
});
const Transaction = mongoose.model('transaction', TransactionSchema);
module.exports = Transaction;