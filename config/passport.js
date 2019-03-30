const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;

passport.use(
new SteamStrategy({
    returnURL: 'http://localhost:8080/',
    realm: 'http://localhost:8080/',
        apiKey: process.env.API_KEY
    },
    (identifier, profile, done) => {
    return done(null, profile);
    }
)
);