var encrypt = require('./encrypt');
var models = require('../models');
//var passport = require('../config/passport');

'use strict';

/* login validation methods */

exports.autoLogin = function (username, pass, callback) {
    console.log('DEBUG: account-manager: auto login');
    //debug('account-manager: auto login');
    models.User.find({where: {username: username}}).then(function (user) {
        if (user) {
            user.password == pass ? callback(user) : callback(null);
        } else {
            callback(null);
        }
    });
};

exports.manualLogin = function (username, pass, callback) {
    console.log('DEBUG: account-manager: manual login');
    models.User.find({where: {username: username}}).then(function (user) {
        if (user == null) {
            callback('user-not-found');
        } else {
            encrypt.validatePassword(pass, user.password, function (err, res) {
                if (res) {
                    callback(null, user);
                } else {
                    callback('invalid-password');
                }
            });
        }
    });
};

exports.addNewAccount = function (newData, callback) {
    //find a user that has an email or username that is equal to the attempted signup
    models.User.find({
            where: {
                $or: [
                    {username: newData.username},
                    {email: newData.email}
                ]
            }
        }
    ).then(function (user) {
        if (user) {
            if (user.username.toLocaleLowerCase() == newData.username.toLocaleLowerCase()) {
                callback('username-taken');
            } else if (user.email.toLocaleLowerCase() == newData.email.toLocaleLowerCase()) {
                callback('email-taken');
            }

        } else {
            encrypt.saltAndHash(newData.password, function (hash) {
                newData.password = hash;
                models.User.create({
                    username: newData.username,
                    password: newData.password,
                    first: newData.first,
                    last: newData.last,
                    email: newData.email,
                    phone: newData.phone,
                }).then((user, err) => {
                    callback(null, user)
                });
            });
        }
    });
};

exports.updateAccount = function (newData, callback) {
    models.User.find({
        where: {
            id: newData.id
        }
    }).then(function (user) {
        user.first = newData.first;
        user.last = newData.last;
        user.phone = newData.phone;

        if (user.email != newData.email) {
            models.User.find({where: {email: newData.email}}).then(function (userWithEmail) {
                if (userWithEmail) {
                    //there's already a user with that email... send an error
                } else {
                    //there isn't a user with that email, update the email
                    user.email = newData.email;
                    user.save().then(function (updatedUser) {
                        if (updatedUser) {
                            callback(null, updatedUser)
                        } else {
                            callback('error-updating-user', null);
                        }
                    });
                }
            });
        } else {
            user.save().then(function (updatedUser) {
                if (updatedUser) {
                    callback(null, updatedUser)
                } else {
                    callback('error-updating-user', null);
                }
            });
        }

    });
};

exports.updatePassword = function (email, newPass, callback) {
    models.User.find({where: {email: email}}).then(function (user) {

        encrypt.saltAndHash(newPass, function (pass) {
            user.password = pass;
            user.save().then(function (updatedUser) {
                if (updatedUser) {
                    callback(null, updatedUser)
                } else {
                    callback('error-updating-user', null);
                }
            });
        });

    });
};

/* account lookup methods */

exports.verifyEmail = function (code, callback) {
    models.User.find({where: {verificationCode: code}}).then(function (user) {
        if (user) {
            var verified = user.verificationStatus;
            if (verified) {
                return callback('already verified', null)
            } else {
                user.verificationStatus = true;
                user.save();
                return callback(null, user)
            }
        } else {
            return callback('invalid link', null)
        }
    });
};

exports.getAccountByEmail = function (email, callback) {
    models.User.find({where: {email: email}}).then(function (user) {
        callback(user);
    });
};

exports.validateResetLink = function (email, passHash, callback) {
    models.User.find({where: {email: email, password: passHash}}).then(function (user) {
        callback(user ? 'ok' : null);
    });
};

exports.getAllRecords = function (callback) {
    models.User.findAll().then(function (users) {
        callback(null, users)
    });
};

exports.delAllRecords = function (callback) {
    //accounts.remove({}, callback); // reset accounts collection for testing //
    callback();
};
