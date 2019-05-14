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
    steamId: {
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
    oldBalance: {
        type: Number,
        default: 0
    },
    ban: {
        type: Number,
        default: 0
    },
    banReason: String

});

const User = mongoose.model('User', UserSchema);
module.exports = User;