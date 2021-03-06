const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        // response will be redirected to steam
    });


require('../controllers/UserController')(router);
require('../controllers/AdminController')(router);
require('../controllers/AuthController')(router);
require('../controllers/DepositController')(router);
require('../controllers/CaseController')(router);
require('../controllers/ItemController')(router);
require('../controllers/CaseItemController')(router);
require('../controllers/TradesController')(router);
require('../controllers/TransactionController')(router);
require('../controllers/OpenCaseController')(router);
require('../controllers/WinningController')(router);
module.exports = router;