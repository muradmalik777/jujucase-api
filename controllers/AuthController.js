const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const config = require('./../config');
const middleware = require('./../middleware');
const admin = require('./../models/Admin');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

module.exports = function (router) {
    router.post('/admin/login', function(req, res) {
        admin.findOne({ email: req.body.email }, function (err, admin) {
            if (admin) {
                bcrypt.compare(req.body.password, admin.password).then(function (success) {
                    if (success) {
                        var token = jwt.sign({ id: admin._id }, config.secret, {
                            expiresIn: 86400
                        });
                        var adminObj = {
                            email: admin.email,
                            id: admin._id,
                            token: token
                        };
                        res.status(200).send({ admin: adminObj });
                    } else {
                        res.status(421).json({ message: "Wrong Password" })
                    }
                });
            }
            else {
                return res.status(420).send('Email not found.');
            }
        });
    });
}