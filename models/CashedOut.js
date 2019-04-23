const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CashedOutSchema = new Schema({
    time: Number,
    amount: mongoose.Decimal128,
    bot: Number
});

const CashedOut = mongoose.model('cashed_out',  CashedOutSchema);
module.exports = CashedOut;