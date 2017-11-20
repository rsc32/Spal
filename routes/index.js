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
                    user.isChief = user.role == "CHIEF";
                    user.isSupervisor = user.role == "SUPERVISOR";
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
                user.isChief = user.role == "CHIEF";
                user.isSupervisor = user.role == "SUPERVISOR";
                req.session.user = user;

                res.cookie('username', user.username, {maxAge: 900000});
                res.cookie('password', user.password, {maxAge: 900000});

                res.status(200).send(user);
            }
        });
    });

    /*
     app.post('/', passport.authenticate('local', {
     successRedirect: '/home',
     failureRedirect: '/',
     failureFlash: true
     }),
     function (req, res) {
     res.redirect('/');
     }
     );
     */

    app.get('/home', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        var ambulanceSquadId = user.ambulanceSquadId;

        DM.getAllUsers(ambulanceSquadId, function (users) {
            res.render('home', {
                title: 'My Spal',
                user: user,
                users: users
            });
        })

    });

    /**
     * This is the page where rigchecks are shown
     * */
    app.get('/rigchecks', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";


        DM.getAllRigchecks(user.id, user.ambulanceSquadId, function (rigchecks) {

            DM.getAllChecklistsOnly(user.ambulanceSquadId, function (checklists) {

                //res.send(rigchecks); return;
                console.log(rigchecks);

                res.render('rigchecks', {
                    title: 'Rig Check',
                    user: user,
                    rigchecks: rigchecks,
                    noChecks: rigchecks.length == 0,
                    checklists: checklists
                });
            })

        });
    });

    /**
     * This gets a rig check and shows the values
     * */
    app.get('/rigchecks/:rigcheckId', isLoggedIn, function (req, res) {
        var user = req.session.user;

        var rigcheckId = req.params.rigcheckId;

        DM.getRigcheck(rigcheckId, function (rigcheck) {
            //res.send(rigcheck); return;

            //var date = moment().format(rigcheck.createdAt.toString());
            //console.log(date.prototype);

            res.render('rigcheck-view', {
                title: 'Rig Check',
                user: user,
                rigcheck: rigcheck
            });
        });

    });

    /**
     * This is the page where a rig check is made
     * */
    app.get('/rigchecks/new/:checklistId', isLoggedIn, function (req, res) {
        var user = req.session.user;

        var checklistId = req.params.checklistId;

        DM.getChecklist(checklistId, function (checklist) {
            //res.send(checklist); return;

            res.render('rigcheck-new', {
                title: 'Rig Check',
                user: user,
                checklist: checklist
                //rigchecks: rigchecks
            });
        });

    });

    /**
     * This is the page where a rig check is made
     * */
    app.post('/rigchecks/new/:checklistId', isLoggedIn, function (req, res) {
        var user = req.session.user;

        //var checklistId = req.params.checklistId;

        var data = JSON.parse(req.body['data']);
        data.fieldValues = JSON.parse(data.fieldValues);
        data.ambulanceSquadId = user.ambulanceSquadId;
        data.userId = user.id;
        data.checklistId = req.params.checklistId;

        for (var i = 0; i < data.fieldValues.length; i++) {
            data.fieldValues[i] = JSON.parse(data.fieldValues[i]);
        }

        //console.log(data);

        DM.createRigcheck(data, function (rigcheck) {
            if (rigcheck) {
                res.status(200).send(rigcheck);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * shows a list of checklists
     * this is only accessible to the Chief and the supervisor
     * */
    app.get('/checklists', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        DM.getAllChecklists(user.ambulanceSquadId, function (checklists) {

            DM.getAllAmbulances(user.ambulanceSquadId, function (ambulances) {
                var noChecklists = checklists.length == 0;

                //res.send(checklists);return;

                res.render('checklists', {
                    title: 'Checklists',
                    user: user,
                    checklists: checklists,
                    ambulances: ambulances,
                    noChecklists: noChecklists
                });
            });

        });
    });

    /**
     * shows the selected checklist
     * this is only accessible to the Chief and the supervisor
     * */
    app.get('/checklists/:checklistId', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        var checklistId = req.params.checklistId;

        DM.getChecklist(checklistId, function (checklist) {
            if (checklist) {
                //res.send(checklist); return;

                res.render('checklist', {
                    title: 'Checklist',
                    user: user,
                    checklist: checklist
                });
            } else {
                res.redirect('/404');
            }
        });

    });

    /**
     * route used to create a checklist
     * */
    app.post('/checklists', isLoggedIn, function (req, res) {
        var user = req.session.user;

        var newData = {
            ambulanceSquadId: user.ambulanceSquadId,
            ambulanceId: req.body['ambulanceId'],
            title: req.body['title']
        };

        console.log(req.body);

        DM.createChecklist(newData, function (checklist) {
            if (checklist) {
                res.status(200).send(checklist);
            } else {
                res.status(400).send(null);
            }
        })
    });

    /**
     * route used to delete a checklist
     * */
    app.delete('/checklists/:checklistId', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isAuthority) {
            console.log("not authority");
            res.status(400).send('error-authority');
            return;
        }

        var checklistId = req.params.checklistId;
        //console.log(checklistId);

        DM.deleteChecklist(checklistId, function (checklist) {
            if (checklist) {
                res.status(200).send(checklist);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * route used to create a compartment of a checklist
     * */
    app.post('/checklists/:checklistId/compartments', isLoggedIn, function (req, res) {

        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isAuthority) {
            res.status(400).send('error-authority');
            return;
        }

        var newData = {
            name: req.body['name'],
            checklistId: req.params.checklistId
        };

        DM.createCompartment(newData, function (compartment) {
            if (compartment) {
                res.status(200).send(compartment);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * route used to delete a compartment of a checklist
     * */
    app.delete('/checklists/:checklistId/compartments/:compartmentId', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isAuthority) {
            res.status(400).send('error-authority');
            return;
        }

        var checklistId = req.params.checklistId;
        var compartmentId = req.params.compartmentId;

        DM.deleteCompartment(checklistId, compartmentId, function (compartment) {
            if (compartment) {
                res.status(200).send(compartment);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * route used to create a field of a compartment of a checklist
     * */
    app.post('/checklists/:checklistId/compartments/:compartmentId', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isAuthority) {
            res.status(400).send('error-authority');
            return;
        }

        var newData = {
            name: req.body['name'],
            compartmentId: req.params.compartmentId,
            checklistId: req.params.checklistId
        };

        //console.log(newData); return;

        DM.createField(newData, function (field) {
            if (field) {
                res.status(200).send(field);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * route used to create a compartment of a checklist
     * */
    app.delete('/checklists/:checklistId/compartments/:compartmentId/fields/:fieldId', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isAuthority) {
            res.status(400).send('error-authority');
            return;
        }

        DM.deleteField(req.params.checklistId, req.params.compartmentId, req.params.fieldId, function (field) {
            if (field) {
                res.status(200).send(field);
            } else {
                res.status(400).send(null);
            }
        });

    });

    /**
     * shows a list of ambulances
     * this is only accessible to the Chief
     * */
    app.get('/ambulances', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isChief) {
            res.status(400).send('error-authority');
            return;
        }

        DM.getAllAmbulances(user.ambulanceSquadId, function (ambulances) {
            //console.log(ambulances);
            if (ambulances.length == 0) {
                var isEmpty = true;
            }
            res.render('ambulances', {
                title: 'Ambulances',
                user: user,
                isEmpty: isEmpty,
                ambulances: ambulances
            });
        });
    });

    app.post('/ambulances', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isChief) {
            res.status(400).send('error-authority');
            return;
        }

        var newData = {
            make: req.body['make'],
            model: req.body['model'],
            color: req.body['color'],
            licensePlate: req.body['licensePlate'],
            truckNumber: req.body['truckNumber']
        };

        DM.createAmbulance(newData, user.ambulanceSquadId, function (ambulance) {
            if (ambulance) {
                res.status(200).send(ambulance);
            } else {
                res.status(400).send(null);
            }
        })
    });

    app.delete('/ambulances', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";
        user.isAuthority = user.isChief || user.isSupervisor;

        if (!user.isChief) {
            res.status(400).send('error-authority');
            return;
        }

        var id = req.body['ambulanceId'];

        DM.deleteAmbulance(id, function (ambulance) {
            if (ambulance) {
                res.status(200).send(ambulance);
            } else {
                res.status(400).send(null);
            }
        })
    });

    /**
     * this page shows information about the Ambulance Squad
     * */
    app.get('/squad', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == 'CHIEF';
        user.isSupervisor = user.role == 'SUPERVISOR';

        DM.getAmbulanceSquad(user.id, user.ambulanceSquadId, function (squad) {

            //res.send(squad); return;

            res.render('squad', {
                title: 'Squad',
                currentUser: user,
                ambulanceSquad: squad
                //users: users
            });
        });
    });

    /**
     * this page shows information about the Ambulance Squad
     * */
    app.put('/squad', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        var newData = {
            squadNumber: req.body['squadNumber'],
            name: req.body['name'],
            street: req.body['street'],
            city: req.body['city'],
            state: req.body['state'],
            zip: req.body['zip'],
            phone: req.body['phone'],
            companyName: req.body['companyName']
        };

        DM.updateAmbulanceSquad(user.ambulanceSquadId, newData, function (squad) {
            if (user) {
                res.status(200).send(squad);
            } else {
                res.status(400).send(null);
            }
        });
    });

    /**
     * this route lets supervisors and chiefs create members of the ambulance squad
     * */
    app.post('/squad', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = (user.role == 'CHIEF');
        user.isSupervisor = (user.role == 'SUPERVISOR');

        console.log(user.isChief);

        if (!user.isChief && !user.isSupervisor) {
            console.log('Logged in user is not an authority');
            res.status(400).send(null);
            return;
        }

        var newData = {
            first: req.body['first'],
            last: req.body['last'],
            email: req.body['email'],
            phone: req.body['phone'],
            role: req.body['role'],
            username: req.body['username'],
            password: req.body['password'],
            ambulanceSquadId: user.ambulanceSquadId
        };

        DM.createSquadUser(newData, function (newUser, err) {
            if (newUser) {
                res.status(200).send(newUser);
            } else {
                console.log(err);
                res.status(400).send(err);
            }

        });
    });

    /**
     * route to delete a user from the ambulance squad
     * */
    app.delete('/squad', isLoggedIn, function (req, res) {

        var id = req.body['userId'];

        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        if (!user.isChief && !user.isSupervisor) {
            res.status(400).send(null);
            return;
        }

        DM.deleteSquadUser(id, function (user) {

            //res.send(user); return;

            if (user) {
                res.status(200).send(user);
            } else {
                res.status(400).send(null);
            }
        });
    });

    /**
     * basic user profile page
     * */
    app.get('/profile', isLoggedIn, function (req, res) {
        var user = req.session.user;
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

        if (user.verificationStatus == 0) {
            user.isNotVerified = true;
        } else {
            user.isNotVerified = false;
        }

        DM.getAmbulanceSquadOnly(user.ambulanceSquadId, function (squad) {
            res.render('profile', {
                title: 'Profile',
                user: user,
                ambulanceSquad: squad
            });
        });

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
        user.isChief = user.role == "CHIEF";
        user.isSupervisor = user.role == "SUPERVISOR";

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

    //TODO let the user insert payment options here
    app.get('/verify', function (req, res) {
        var code = req.query.c;

        AM.verifyEmail(code, (err, user) => {
            if (user) {
                AM.autoLogin(user.username, user.password, (user) => {
                    if (!user) {
                        return res.redirect('/');
                    } else {
                        user.isChief = user.role == "CHIEF";
                        user.isSupervisor = user.role == "SUPERVISOR";
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
        }, function (err) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send('ok');
            }
        });
    });

    app.post('/lost-password', function (req, res) {
        // look up the user's account via their email //
        AM.getAccountByEmail(req.body['email'], function (o) {
            if (o) {
                /**
                 EM.dispatchResetPasswordLink(o, function (e, m) {
                    // this callback takes a moment to return //
                    // TODO add an ajax loader to give user feedback //
                    if (!e) {
                        res.status(200).send('ok');
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                    }
                });

                 **/
            } else {
                res.status(400).send('email-not-found');
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
