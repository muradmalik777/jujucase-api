var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var WinningSchema = new Schema({
    user_id: String,
    case_id: String,
    clientHash: String,
    outcomeId: String,
    sold: { type: Boolean, default: false },
    withdrawn: { type: Boolean, default: false },
    voucherCode: String,
    widthdrawlUrl: String,
    roundSecret: String,
    ticketNumber: Number,
    winningItem: String,
    time: { type: Date, default: Date.now },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'CaseItem'
    }
});

const model = mongoose.model('Winning', WinningSchema);
module.exports = model;