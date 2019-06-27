let winningUrl = '/winning/';
const Items = require('../models/Item');
const Winnings = require('../models/Winning');


module.exports = function (router) {

    // Get all items won by a specific user
    router.post('/user/winning', function (req, res) {
        var limit = 12
        var totalCount = 0
        Winnings.countDocuments({ user_id: req.body.user_id }).exec().then(count => {
            totalCount = count
            Winnings.find({ user_id: req.body.user_id, sold: false }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0, sold: 0 } ).populate('item').exec().then(unsold => {
                Winnings.find({ user_id: req.body.user_id, sold: true }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0, sold: 0 }).populate('item').exec().then(sold => {
                    res.status(200).json({
                        total_count: totalCount,
                        sold_items: sold,
                        unsold_items: unsold
                    })
                })
            })
        })
    });

    // Get all items won from a specific case
    router.post('/case/winning', function (req, res) {
        Winnings.find({ case_id: req.body.case_id }, { roundSecret: 0, ticketNumber: 0, clientHash: 0, outcomeId: 0 }).limit(12).populate('item').exec().then(docs => {
            res.status(200).json(docs)
        })
    });
};