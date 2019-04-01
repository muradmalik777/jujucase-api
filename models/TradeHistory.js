var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TradeHistory = new Schema({
    amount: {
        type: Number
    },
    status: {
        type: String
    },
    code: {
        type: Number
    },
    bot: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TradeHistory', TradeHistory);