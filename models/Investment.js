const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let InvestmentSchema = new Schema({
    
    steam_id: String,
    amount: mongoose.Decimal128,
    description: String,
    time: Number
});

const Investment = mongoose.model('investment',  InvestmentSchema);
module.exports = Investment;