const CaseItem = require('../models/CaseItem');
const Case = require('../models/Case');
const _ = require('lodash');
const caseItemUrl = '/cases/:caseId/items/';

module.exports = function (router) {

    // Get all items of a case items
    router.get(caseItemUrl, function (req, res) {
        Case.findById(req.params.caseId).exec()
            .then(docs => {
                if (docs) {
                    CaseItem.find({case_id: req.params.caseId}).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding case items',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'case not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding case',
                        error: err
                    });
            });
    });

    // Get case item by id
    router.get(`${caseItemUrl}:id`, function (req, res) {
        Case.findById(req.params.caseId).exec()
            .then(docs => {
                if (docs) {
                    CaseItem.findById(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding case Items',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'case not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding case',
                        error: err
                    });
            });
    });

    // Create a case item
    router.post(caseItemUrl, function (req, res) {
        Case.findById(req.params.caseId).exec()
            .then(docs => {
                if (docs) {
                    req.body = {...req.body, case_id: req.params.caseId};
                    let caseObject = new CaseItem(req.body);
                    caseObject.save(function (err, user) {
                        res.status(200).json(user)
                    })
                } else {
                    res.status(404)
                        .json({
                            message: 'case not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding case',
                        error: err
                    });
            });
    });

    // Update a case item
    router.put(`${caseItemUrl}:id`, function (req, res) {
        Case.findById(req.params.caseId).exec()
            .then(docs => {
                if (docs) {
                    if (req.body.case_id) {
                        res.status(500)
                            .json({
                                message: 'invalid json'
                            });
                    } else {
                        CaseItem.findById(req.params.id, function (err, caseItemObject) {
                            if (err) {
                                res.json({info: 'error during find case item', error: err});
                            }
                            if (caseItemObject) {
                                _.merge(caseItemObject, req.body);
                                caseItemObject.save(function (err) {
                                    if (err) {
                                        res.json({info: 'error during case item update', error: err});
                                    }
                                    ;
                                    res.status(200).json(caseItemObject)
                                });
                            } else {
                                res.json({info: 'case item not found'});
                            }
                        });
                    }
                } else {
                    res.status(404)
                        .json({
                            message: 'case not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding case',
                        error: err
                    });
            });
    });

    //Delete a case item
    router.delete(`${caseItemUrl}:id`, function (req, res) {
        Case.findById(req.params.caseId).exec()
            .then(docs => {
                if (docs) {
                    CaseItem.findByIdAndDelete(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding case item',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'case not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding case',
                        error: err
                    });
            });
    });
};