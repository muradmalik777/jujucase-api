const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let DepositSchema = new Schema({

    userId: String,
    amount: Number,
    currency: String,
    successUrl: String,
    cancelUrl: String,
    transactionId: String, 
    description: String,
    customValue: String,
    success: { type: Boolean, default: false},
    time: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('deposits', DepositSchema);
module.exports = Transaction;