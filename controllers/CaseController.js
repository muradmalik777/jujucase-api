const Case = require('../models/Case');
const CaseItem = require('../models/CaseItem');
const _ = require('lodash');
let casesUrl = '/cases/';

module.exports = function (router) {

    // Get all cases
    router.get(casesUrl, function (req, res) {
        var limit = 12
        var totalCount = 0
        Case.countDocuments().exec().then(count => {
            totalCount = count
            Case.find().limit(limit).skip((req.query.p - 1) * limit).populate('items').exec()
                .then(docs => res.status(200)
                    .json({
                        "totalCount": totalCount,
                        "items": docs
                    }))
                .catch(err => res.status(500)
                    .json({
                        message: 'Error finding Items',
                        error: err
                    }))
        })
    });

    // Get case by id
    router.get(`${casesUrl}:id`, function (req, res) {
        Case.findById(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding case',
                    error: err
                }))
    });

    // Get cases created by a specific user (steam_id)
    router.get(`${casesUrl}user/:steam_id`, function (req, res) {
        Case.find({ steam_id: req.params.steam_id }).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding cases using steam_id',
                    error: err
                }))
    });

    // Create a case
    router.post(casesUrl, function (req, res) {
        let items = req.body.items;
        let newCase = req.body;
        newCase.items = [];
        let caseObject = new Case(newCase);
        caseObject.save(function(err, store) {});
        let itemsProcessed = 0;
        let totalItems = items.length;

        items.forEach(function(element) {
            delete element._id;
            delete element.__v;
            item = new CaseItem(element);
            item.save(function(err, item) {
                caseObject.items.push(item);
                itemsProcessed += 1;
                if (itemsProcessed == totalItems) {
                    caseObject.save(function(err, caseObj) {
                        if (err) return console.log(err);
                        res.status(200).json(caseObj);
                    });
                }
            });
        });
    });

    // Update a case
    router.put(`${casesUrl}:id`, function (req, res) {
        Case.findById(req.params.id, function (err, caseObject) {
            if (err) {
                res.json({info: 'error during find case', error: err});
            };
            if (caseObject) {
                _.merge(caseObject, req.body);
                caseObject.save(function (err) {
                    if (err) {
                        res.json({info: 'error during case update', error: err});
                    };
                    res.status(200).json(caseObject)
                });
            } else {
                res.json({info: 'case not found'});
            }
        });
    });

    //Delete a case
    router.delete(`${casesUrl}:id`, function (req, res) {
        Case.findByIdAndDelete(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding case',
                    error: err
                }))
    });
};
