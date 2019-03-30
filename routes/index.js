const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');


router.get('/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        // response will be redirected to steam
    });

router.get('/user', UserController.userData);

module.exports = router;