var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    user_name: {
        type: String,
        default: "user_name"
    },
    email: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    avatar: String,
    steam_id: {
        type: String,
        default: null
    },
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
        type: Number,
        default: 0
    },
    oldbalance: {
        type: Number,
        default: 0
    },
    deposited: {
        type: Number,
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
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },
    refprofit: {
        type: Number,
        default: 0
    },
    profit: {
        type: Number,
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

const User = mongoose.model('User', UserSchema);
module.exports = User;