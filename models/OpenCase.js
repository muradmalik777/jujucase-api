var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CaseOpenedSchema = new Schema({
    user_id: String,
    clientHash: String,
    time: { type: Date, default: Date.now },
    case: {
        type: Schema.Types.ObjectId,
        ref: 'Case'
    }
});

const OpenCase = mongoose.model('OpenCase', CaseOpenedSchema);
module.exports = OpenCase;