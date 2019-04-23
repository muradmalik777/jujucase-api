const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OpskinProfitSchema = new Schema({
    
    profit: mongoose.Decimal128,
    balance: mongoose.Decimal128,
    inv_profit: mongoose.Decimal128,
    inv_total: mongoose.Decimal128,
    time: Number
});

const OpskinProfit = mongoose.model('opskin_profit', OpskinProfitSchema);
module.exports = OpskinProfit;