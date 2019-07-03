const request = require('request');
const AdminModel = require('../models/Admin');
const generateId = require('uniqid');
require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 3;
const middleware = require('./../middleware');
let adminUrl = '/admin/';


module.exports = function (router) {

    // add admin
    router.post(adminUrl + 'add', middleware, function (req, res) {
        let adminData = req.body;
        AdminModel.findOne({email: req.body.email}, function(error, user){
            if (user) {
                res.status(420).json({ message: "Email already exist" })
            } else {
                bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                    adminData.password = hash
                    let adminObject = new AdminModel(adminData);
                    adminObject.save(function (err, admin) {
                        delete admin.password
                        res.status(200).json(admin)
                    });
                });
            }
        })
    });

    // change admin password
    router.put(`${adminUrl}:id`, middleware, function (req, res) {
        AdminModel.findById(req.params.id, function (err, adminObject) {
            if (err) {
                res.json({ info: 'error finding admin', error: err });
            };
            if (adminObject) {
                bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
                    adminObject.password = hash
                    adminObject.save(function (err, admin) {
                        delete admin.password
                        res.status(200).json(admin)
                    });
                });
            } else {
                res.json({ info: 'admin not found' });
            }
        });
    });

    // get all admins
    router.get(adminUrl, middleware, function (req, res) {
        AdminModel.countDocuments().exec().then(count => {
            totalCount = count
            AdminModel.find().exec()
                .then(docs => res.status(200)
                    .json({
                        "total_count": totalCount,
                        "items": docs
                    }))
                .catch(err => res.status(500)
                    .json({
                        message: 'Error finding Admins',
                        error: err
                    }))
        })
    });

    // delete admin
    router.delete(`${adminUrl}:id`, middleware, function (req, res) {
        if (req.userId === req.params.id) {
            res.status(200).json({
                status: 'You Cannot Delete this admin',
            })
        } else {
            AdminModel.findByIdAndDelete(req.params.id).exec()
                .then(docs => res.status(200)
                    .json(docs))
                .catch(err => res.status(500)
                    .json({
                        message: 'Error finding Admin',
                        error: err
                }))
        }
    });
};

