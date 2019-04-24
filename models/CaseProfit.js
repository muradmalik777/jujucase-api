const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CaseProfitSchema = new Schema({
    time: Number,
    profit: mongoose.Decimal128
});

const CaseProfit = mongoose.model('case_profit',  CaseProfitSchema);
module.exports = CaseProfit;