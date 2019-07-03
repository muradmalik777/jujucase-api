const User = require('../models/User');
const Transaction = require('../models/Transaction');
const _ = require('lodash');
const TransactionUrl = '/users/:steamId/transaction';

//TODO: get steam_id by jwt and remove from `TradesUrl`

module.exports = function (router) {

    // Get all Transaction of a user
    router.get(TransactionUrl, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec()
            .then(docs => {
                if (docs) {
                    Transaction.find({steam_id: req.params.steamId}).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding transaction',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Get transaction by id 
    router.get(`${TransactionUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec()
            .then(docs => {
                if (docs) {
                    Transaction.findById(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding transaction',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Create a transaction
    router.post(TransactionUrl, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec()
            .then(docs => {
                if (docs) {
                    req.body = {...req.body, steam_id: req.params.steamId};
                    let transactionObject = new Transaction(req.body);
                    transactionObject.save(function (err, user) {
                        res.status(200).json(user)
                    })
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    // Update transaction
    router.put(`${TransactionUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec().exec()
            .then(docs => {
                if (docs) {
                    if (req.body.steam_id) {
                        res.status(500)
                            .json({
                                message: 'invalid json'
                            });
                    } else {
                        Transaction.findById(req.params.id, function (err, TransactionObject) {
                            if (err) {
                                res.json({info: 'error during find transaction', error: err});
                            }
                            if (TransactionObject) {
                                _.merge(TransactionObject, req.body);
                                TransactionObject.save(function (err) {
                                    if (err) {
                                        res.json({info: 'error during transaction update', error: err});
                                    }
                                    ;
                                    res.status(200).json(TransactionObject)
                                });
                            } else {
                                res.json({info: 'transaction not found'});
                            }
                        });
                    }
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });

    //Delete a transaction
    router.delete(`${TransactionUrl}:id`, function (req, res) {
        User.findOne({steam_id: req.params.steamId}).exec().exec()
            .then(docs => {
                if (docs) {
                    Transaction.findByIdAndDelete(req.params.id).exec()
                        .then(docs => res.status(200)
                            .json(docs))
                        .catch(err => res.status(500)
                            .json({
                                message: 'Error finding users transaction',
                                error: err
                            }));
                } else {
                    res.status(404)
                        .json({
                            message: 'user not found'
                        });
                }
            })
            .catch(err => {
                res.status(500)
                    .json({
                        message: 'Error finding user',
                        error: err
                    });
            });
    });
};