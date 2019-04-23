const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProfitTrackingSchema = new Schema({
    
    steam_id: String,
    name: String,
    refprofit: mongoose.Decimal128,
    difference: mongoose.Decimal128,
    profit: mongoose.Decimal128,
    referrals: Number,
    depositors: Number,
    time: Number

});

const ProfitTracking = mongoose.model('profit_tracking',  ProfitTrackingSchema);
module.exports = ProfitTracking;