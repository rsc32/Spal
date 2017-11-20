var EM = require("../modules/email-dispatcher");
var AM = require('../modules/account-manager');
var DM = require('../modules/data-manager');
var passport = require('passport');
var path = require('path');
var moment = require('moment');

module.exports = function (app) {

    function isLoggedIn(req, res, next) {
        if (req.cookies.username == undefined || req.cookies.password == undefined) {
            //redirect to login page
            // console.log('DEBUG: isLoggedIn: false');
            req.session.destroy();
            res.redirect('/');
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.username, req.cookies.password, function (user) {
                if (user != null) {
                    user.isChief = user.role == "CHIEF";
                    user.isSupervisor = user.role == "SUPERVISOR";
                    req.session.user = user;
                }
                //console.log('DEBUG: isLoggedIn: true');
                //go to the next function
                return next();
            });
        }
    }

    app.get('/', function (req, res) {
        if (req.cookies.username == undefined || req.cookies.password == undefined) {
            res.render('login', {title: 'Hello - Please Login To Your Account'});
        } else {
            // attempt automatic login //
            AM.autoLogin(req.cookies.username, req.cookies.password, function (user) {
                if (user != null) {
                    req.session.user = user;
                    res.redirect('/home');
                } else {
                    res.render('login', {title: 'Hello - Please Login To Your Account'});
                }
            });
        }
    });

    app.post('/', function (req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function (err, user) {
            if (!user) {
                res.status(400).send(err);
            } else {
                req.session.user = user;
                res.cookie('username', user.username, {maxAge: 900000});
                res.cookie('password', user.password, {maxAge: 900000});
                res.status(200).send(user);
            }
        });
    });

    app.get('/home', isLoggedIn, function (req, res) {
        return res.render('home', {title: 'My SmartPal', user: req.session.user});
    });

    app.get('/messages', isLoggedIn, function (req, res) {
        return res.render('messages', {title: 'Send and Receive messages', user: req.session.user});
    });

    app.get('/journals', isLoggedIn, function (req, res) {
        return res.render('journals', {title: 'Journals', user: req.session.user});
    });

    app.get('/codes', isLoggedIn, function (req, res) {
        return res.render('codes', {title: 'My Codes', user: req.session.user});
    });

    /**
     * basic user profile page
     * */
    app.get('/profile', isLoggedIn, function (req, res) {
        var user = req.session.user;

        if (user.verificationStatus == 0) {
            user.isNotVerified = true;
        } else {
            user.isNotVerified = false;
        }

        res.render('profile', {title: 'Profile', user: user});
    });

    /**
     * update the user's profile route
     * */
    app.put('/profile', isLoggedIn, function (req, res) {
        var user = req.session.user;
        var newData = {
            id: user.id,
            first: req.body['first'],
            last: req.body['last'],
            email: req.body['email'],
            phone: req.body['phone']
        };

        AM.updateAccount(newData, function (err, user) {
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(400).send(null);
            }
        });
    });

    /**
     * basic help page to help users understand how to use the app
     * */
    app.get('/help', isLoggedIn, function (req, res) {
        var user = req.session.user;

        res.render('help', {
            title: 'Help',
            user: user
        });
    });

    app.post('/logout', function (req, res) {
        console.log('DEBUG: logout post');
        //passport.destroySession();
        res.clearCookie('username');
        res.clearCookie('password');
        req.session.destroy(function (err) {
            res.status(200).send('ok');
        });
    });

    app.get('/verify', function (req, res) {
        AM.verifyEmail(req.query.c, (err, user) => {
            if (user) {
                AM.autoLogin(user.username, user.password, (user) => {
                    if (!user) {
                        return res.redirect('/');
                    } else {
                        req.session.user = user;

                        res.cookie('username', user.username, {maxAge: 900000});
                        res.cookie('password', user.password, {maxAge: 900000});
                        res.redirect('/profile').send('Email verified');
                    }
                });
            } else {
                console.log(err);
                return res.redirect('/');
            }
        });
    });

    app.get('/signup', function (req, res) {
        res.render('signup', {title: 'Signup'});
    });

    app.post('/signup', function (req, res) {
        AM.addNewAccount({
            first: req.body['first'],
            last: req.body['last'],
            email: req.body['email'],
            phone: req.body['phone'],
            username: req.body['username'],
            password: req.body['password']
        }, function (err, user) {
            if (err) {
                res.status(400).send(err);
            } else {
                EM.dispatchVerifyEmail(user, () => {
                    return res.status(200).send('ok');
                });
            }
        });
    });

    app.post('/lost-password', function (req, res) {
        // look up the user's account via their email //
        AM.getAccountByEmail(req.body['email'], function (user) {
            if (user) {
                EM.dispatchResetPasswordLink(user, function (e, m) {
                    if (e) {
                        return res.status(400).send('unable to dispatch password reset');
                    } else {
                        return res.status(200).send('ok');
                    }
                });
            } else {
                return res.status(400).send('email-not-found');
            }
        });
    });

    app.get('/reset-password', function (req, res) {
        var email = req.query["o"];
        var passH = req.query["j"];
        //return res.render('reset', {title: 'Reset Password'});
        AM.validateResetLink(email, passH, function (e) {
            if (e != 'ok') {
                res.redirect('/');
            } else {
                // save the user's email in a session instead of sending to the client //
                req.session.reset = {email: email};
                res.render('reset', {title: 'Reset Password'});
            }
        })
    });

    app.post('/reset-password', function (req, res) {
        console.log("reset password");
        var nPass = req.body['pass'];
        // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
        // destroy the session immediately after retrieving the stored email //
        req.session.destroy();
        AM.updatePassword(email, nPass, function (err, obj) {
            if (obj) {
                return res.status(200).send('ok');
            } else {
                return res.status(400).send('unable to update password');
            }
        })
    });

    app.get('/', function (req, res) {
        //do shit for verif
    });

    app.get('*', function (req, res) {
        res.render('404', {title: 'Page Not Found'});
    });

};
