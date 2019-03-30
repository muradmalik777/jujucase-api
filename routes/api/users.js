const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
// const Users = mongoose.model('User');

router.get('/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    // response will be redirected to steam
  });

router.get('/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    // res.redirect('/');
});

module.exports = router;