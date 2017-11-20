var models = require('../models');
var bCrypt = require('bcrypt-nodejs');
var AM = require('../modules/account-manager');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log('serializing user:', user.username);
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        models.User.findById(id, function (err, user) {
            console.log('deserializing user:', user.username);
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(function (req, username, password, done) {
            AM.manualLogin(req.body['user'], req.body['pass'], function (err, user) {
                if (!user) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send(user);
                }
            });

        }
    ));


    // compares passwords using bcrypt
    var isValidPassword = function (user, password) {
        return bCrypt.compareSync(password, user.password);
    };

};
