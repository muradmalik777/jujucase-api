let winningUrl = '/winning/';
const Items = require('../models/Item');
const Winnings = require('../models/Winning');


module.exports = function (router) {

    // Get all cases opened byt user
    router.post(winningUrl, function (req, res) {
        var limit = 12
        var totalCount = 0
        Case.countDocuments().exec().then(count => {
            totalCount = count
            Case.find().limit(limit).skip((req.query.p - 1) * limit).populate('items').exec()
                .then(docs => res.status(200)
                    .json({
                        "total_count": totalCount,
                        "items": docs
                    }))
                .catch(err => res.status(500)
                    .json({
                        message: 'Error finding Items',
                        error: err
                    }))
        })
    });
};