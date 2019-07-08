var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Trade = new Schema({
    time: { type: Date, default: Date.now },
    tradeReason: { type: String, default: null },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'Winning'
    }
});

module.exports = mongoose.model('Trade', Trade);