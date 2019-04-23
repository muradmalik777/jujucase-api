const Transaction = require('../models/Transaction');
const _ = require('lodash');

module.exports = function (router) {

//Get All Transactions
router.get('/transactions', function (req, res) {
    Transaction.find().exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error Finding Transaction',
                error: err
            }))
});

//Get Transaction by id
router.get('/transactions/:id', function (req,res) {
    Transaction.findById(req.params.id).exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error Finding Transaction',
                error: err
            }))
        });

//Create a Transaction
router.post('/transactions', function (req,res)  {
    let transactionObject = new Transaction(req.body);
    transactionObject.save(function (err, user) {
        if(err) return console.log(err);
        res.status(200).json(user)
    })
});

// Update a transaction
router.put('/transactions/:id', function (req, res) {
    Transaction.findById(req.params.id, function (err, transactionObject) {
        if (err) {
            res.json({info: 'error during find transaction', error: err});
        };
        if (transactionObject) {
            _.merge(transactionObject, req.body);
            transactionObject.save(function (err) {
                if (err) {
                    res.json({info: 'error during transaction update', error: err});
                };
                res.status(200).json(transactionObject)
            });
        } else {
            res.json({info: 'transaction not found'});
        }
    });
});

//Delete a transaction
router.delete('/transactions/:id', function (req, res) {
    Transaction.findByIdAndDelete(req.params.id).exec()
        .then(docs => res.status(200)
            .json(docs))
        .catch(err => res.status(500)
            .json({
                message: 'Error finding transaction',
                error: err
            }))
});

}