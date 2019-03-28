const mongoose = require('mongoose');
const passport = require('passport');
// const LocalStrategy = require('passport-local');
const SteamStrategy = require('passport-steam').Strategy;

const Users = mongoose.model('User');

// passport.use(new LocalStrategy({
//   usernameField: 'user[email]',
//   passwordField: 'user[password]',
// }, (email, password, done) => {
//   Users.findOne({ email })
//     .then((user) => {
//       if(!user || !user.validatePassword(password)) {
//         return done(null, false, { errors: { 'email or password': 'is invalid' } });
//       }

//       return done(null, user);
//     }).catch(done);
// }));

// passport.serializeUser((user, done) => {
//     done(null, user._json);
//   });
  
//   passport.deserializeUser((obj, done) => {
//     done(null, obj);
//   });

passport.use(
new SteamStrategy(
    {
    returnURL: 'http://localhost:8080/',
    realm: 'http://localhost:8080/',
    apiKey: 'A0CE39A56BA4992D432D0B8E9E3BBD4B'
    },
    (identifier, profile, done) => {
    return done(null, profile);
    }
)
);