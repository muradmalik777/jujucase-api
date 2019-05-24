var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CaseOpenedSchema = new Schema({
    user_id: String,
    case_id: String,
    clientHash: String,
    time: { type: Date, default: Date.now }
});

const OpenCase = mongoose.model('OpenCase', CaseOpenedSchema);
module.exports = OpenCase;