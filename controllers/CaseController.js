const Case = require('../models/Case');
const CaseItem = require('../models/CaseItem');
const _ = require('lodash');
const multer = require('multer');
let casesUrl = '/cases/';
require('dotenv').config();


const upload = multer({
    dest: './uploads'
});

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

    // Get all cases literally
    router.get(casesUrl + 'all', function (req, res) {
        var totalCount = 0
        Case.countDocuments().exec().then(count => {
            totalCount = count
            Case.find().populate('items').exec()
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

    // Get case by id
    router.get(`${casesUrl}:id`, function (req, res) {
        Case.findById(req.params.id).populate('items').exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding case',
                    error: err
                }))
    });

    // Get cases created by a specific user (steam_id)
    router.post(`${casesUrl}user/`, function (req, res) {
        Case.find({ steam_id: req.body.steam_id }).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding cases using user_id',
                    error: err
                }))
    });

    // Create a case
    router.post(casesUrl, function (req, res) {
        let items = req.body.items;
        let newCase = req.body;
        newCase.slug = newCase.name.replace(" ", "-").toLowerCase()
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
                        res.status(200).json(caseObj);
                    });
                }
            });
        });
    });

    // Admin creates a case
    router.post('/admin' + casesUrl, upload.array('images', 2), function (req, res) {
        let items = JSON.parse(req.body.items);
        let newCase = req.body;
        newCase.items = [];
        if (process.env.NODE_ENV === 'development') {
            newCase.skin_image = "http://localhost:8081/" + req.files[0].path;
            newCase.case_image = "http://localhost:8081/" + req.files[1].path;
        } else if (process.env.NODE_ENV === 'test') {
            newCase.skin_image = "https://test.jujucase.com/" + req.files[0].path;
            newCase.case_image = "https://test.jujucase.com/" + req.files[1].path;
        } else {
            newCase.skin_image = "https://jujucase.com/" + req.files[0].path;
            newCase.case_image = "https://jujucase.com/" + req.files[1].path;
        }
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
                        res.status(200).json(caseObj);
                    });
                }
            });
        });
    });

    // Admin Updates a case
    router.put(`/admin${casesUrl}:id`, upload.array('images', 2), function (req, res) {
        Case.findById(req.params.id, function (err, caseObject) {
            if (err) {
                res.json({info: 'error during find case', error: err});
            };
            if (caseObject) {
                let items = JSON.parse(req.body.items);
                let newCase = req.body;
                newCase.items = [];
                caseObject.items = [];
                if (req.files[0] && req.files[0].path) {
                    newCase.skin_image = req.files[0].path;
                } else if (req.files[1] && req.files[1].path) {
                    newCase.case_image = req.files[1].path;
                }
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
                            _.merge(caseObject, newCase);
                            caseObject.save(function (err, data) {
                                if (err) {
                                    res.json({info: 'error during case update', error: err});
                                };
                                res.status(200).json(data)
                            });
                        }
                    });
                });
            } else {
                res.json({info: 'case not found'});
            }
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
