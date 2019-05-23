const CaseOpened = require('../models/CaseOpened');
const CaseItem = require('../models/CaseItem');
let caseOpenedUrl = '/caseOpened/';
const request = require('request');


module.exports = function (router) {

    // Get all cases
    router.get(caseOpenedUrl, function (req, res) {
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

    // Get cases created by a specific user (steam_id)
    router.get(`${caseOpenedUrl}user/:id`, function (req, res) {
        Case.find({ user_id: req.params.user_id }).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding cases using steam_id',
                    error: err
                }))
    });

    // Create a case
    router.post(caseOpenedUrl, function (req, res) {
        let newCase = req.body;
        let caseOpenedObject = new CaseOpened(newCase);
        caseOpenedObject.save(function (err, store) { 
            console.log(store)
            res.status(200).json("success")
        });
    });
};
