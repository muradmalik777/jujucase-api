var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    user_name: {
        type: String,
        default: "user_name"
    },
    avatar: String,
    steam_id: Number,
    referral: String,
    code: String,
    hash: String,
    mute: {
        type: Number,
        default: 0
    },
    rank: {
        type: String,
        default: 0
    },
    balance: {
        type: mongoose.Decimal128,
        default: 0.00000
    },
    oldbalance: {
        type: mongoose.Decimal128,
        default: 0.00000
    },
    deposited: {
        type: mongoose.Decimal128,
        default: 0
    },
    visitors: {
        type: Number,
        default: 0
    },
    depositors: {
        type: Number,
        default: 0
    },
    claim: {
        type: mongoose.Decimal128,
        default: 0
    },
    earnings: {
        type: mongoose.Decimal128,
        default: 0
    },
    refprofit: {
        type: mongoose.Decimal128,
        default: 0
    },
    profit: {
        type: mongoose.Decimal128,
        default: 0
    },
    demo: {
        type: Number,
        default: 0
    },
    daily: {
        type: Number,
        default: 0
    },
    group: {
        type: Number,
        default: 0
    },
    last_profit_update: {
        type: Number,
        default: 0
    },
    ban: {
        type: Number,
        default: 0
    },
    ban_reason: String

});

module.exports = mongoose.model('User', User);