const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let CaseSchema = new Schema({
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

const Case = mongoose.model('Case', CaseSchema);
module.exports = Case;