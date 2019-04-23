const Case = require('../models/Case');
const _ = require('lodash');

module.exports = function (router) {

    // Get all cases
    router.get('/cases', function (req, res) {
        Case.find().exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding case',
                    error: err
                }))
    });

    // Get case by id
    router.get('/cases/:id', function (req, res) {
        Case.findById(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding case',
                    error: err
                }))
    });

    // Create a case
    router.post('/cases', function (req, res) {
        let caseObject = new Case(req.body);
        caseObject.save(function (err, user) {
            if (err) return console.log(err);
            res.status(200).json(user)
        })
    });

    // Update a case
    router.put('/cases/:id', function (req, res) {
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
    router.delete('/cases/:id', function (req, res) {
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