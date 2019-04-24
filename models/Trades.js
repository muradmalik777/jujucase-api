var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Trades = new Schema({
    amount:  mongoose.Decimal128,
    status:  String,
    code: Number,
    bot_id: String,
    steam_id: String,
    time: Number
});

module.exports = mongoose.model('Trades', Trades);