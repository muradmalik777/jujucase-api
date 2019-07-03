const Item = require('../models/Item');
const _ = require('lodash');
let itemsUrl = '/items/';

module.exports = function (router) {

    // Get all items
    router.get(itemsUrl, function (req, res) {
        var limit = 12
        var totalCount = 0
        Item.countDocuments({ price: { $gt: 0 } }).exec().then(count => {
            totalCount = count
            Item.find({ price: { $gt: 0 } }).limit(limit).skip(req.query.p * limit).exec()
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

    // Get Item by id
    router.get(`${itemsUrl}:id`, function (req, res) {
        Item.findById(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding Item',
                    error: err
                }))
    });

    // Get items created by a specific user (steam_id)
    router.get(`${itemsUrl}user/:steam_id`, function (req, res) {
        Item.find({ steam_id: req.params.steam_id }).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding items using steam_id',
                    error: err
                }))
    });

    // Create a Item
    router.post(itemsUrl, function (req, res) {
        let ItemObject = new Item(req.body);
        ItemObject.save(function (err, user) {
            res.status(200).json(user)
        })
    });

    // Update a Item
    router.put(`${itemsUrl}:id`, function (req, res) {
        Item.findById(req.params.id, function (err, ItemObject) {
            if (err) {
                res.json({info: 'error during find Item', error: err});
            };
            if (ItemObject) {
                _.merge(ItemObject, req.body);
                ItemObject.save(function (err) {
                    if (err) {
                        res.json({info: 'error during Item update', error: err});
                    };
                    res.status(200).json(ItemObject)
                });
            } else {
                res.json({info: 'Item not found'});
            }
        });
    });

    //Delete a Item
    router.delete(`${itemsUrl}:id`, function (req, res) {
        Item.findByIdAndDelete(req.params.id).exec()
            .then(docs => res.status(200)
                .json(docs))
            .catch(err => res.status(500)
                .json({
                    message: 'Error finding Item',
                    error: err
                }))
    });
};
