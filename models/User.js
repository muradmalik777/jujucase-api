var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var User = new Schema({
    user_name: {
        type: String,
        default: "user_name"
    },
    avatar: {
        type: String
    },
    steam_id: {
        type: Number
    }
});

module.exports = mongoose.model('User', User);