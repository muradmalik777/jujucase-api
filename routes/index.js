const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');


router.get('/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        // response will be redirected to steam
    });

router.post('/user', UserController.loginOrCreateUser);

// Case Controller
require('../controllers/CaseController')(router);

// Case Item Controller
require('../controllers/CaseItemController')(router);

// Trade Controller
require('../controllers/TradesController')(router);

// Transaction Controller
require('../controllers/TransactionController')(router);


module.exports = router;