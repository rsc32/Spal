var models = require('../models');
var encrypt = require('./encrypt');

/**
 * gets the list of ambulances associated with an ambulance squad
 * */
exports.getAllAmbulances = function (squadId, callback) {
    models.Ambulance.findAll({
        where: {
            ambulanceSquadId: squadId
        }
    }).then(function (ambulances) {
        if (ambulances) {
            callback(ambulances);
        } else {
            callback(null);
        }
    });
};

/**
 * get an ambulance by id
 * */
exports.getAmbulance = function (ambulanceId, callback) {
    models.Ambulance.find({
        where: {
            id: ambulanceId
        }
    }).then(function (ambulance) {
        if (ambulance) {
            callback(ambulance);
        } else {
            callback(null);
        }
    });
};

/**
 * creates a new ambulance and associates it with an ambulance squad
 * */
exports.createAmbulance = function (newData, squadId, callback) {
    console.log(newData);
    models.Ambulance.create({
        make: newData.make,
        model: newData.model,
        color: newData.color,
        licensePlate: newData.licensePlate,
        truckNumber: newData.truckNumber,
        ambulanceSquadId: squadId
    }).then(function (ambulance) {
        if (ambulance) {
            callback(ambulance);
        } else {
            callback(null);
        }
    });
};

/**
 * deletes an ambulance object
 * */
exports.deleteAmbulance = function (ambulanceId, callback) {
    models.Ambulance.find({
        where: {
            id: ambulanceId
        }
    }).then(function (ambulance) {
        if (ambulance) {
            //console.log(ambulance);
            ambulance.destroy().then(callback);
        } else {
            callback(null);
        }
    });
};

/**
 * method to create a new checklist
 * */
exports.createChecklist = function (newData, callback) {
    console.log(newData);
    models.Checklist.create({
        ambulanceId: newData.ambulanceId,
        ambulanceSquadId: newData.ambulanceSquadId,
        title: newData.title
    }).then(function (checklist) {
        if (checklist) {
            callback(checklist);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all checklists for the squad
 * This also returns ambulance, compartments, and fields
 * */
exports.getAllChecklists = function (squadId, callback) {
    models.Checklist.findAll({
        where: {
            ambulanceSquadId: squadId
        },
        include: [
            models.Ambulance,
            {
                model: models.Compartment,
                include: models.Field
            }
        ]
    }).then(function (checklists) {
        //console.log(checklists);
        if (checklists) {
            callback(checklists);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all checklists for the rig check page
 * This also returns ambulance objects
 * */
exports.getAllChecklistsOnly = function (squadId, callback) {
    models.Checklist.findAll({
        where: {
            ambulanceSquadId: squadId
        },
        include: [
            models.Ambulance
        ]
    }).then(function (checklists) {
        //console.log(checklists);
        if (checklists) {
            callback(checklists);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get a checklist by id
 * this also gets the compartments and field objects
 * */
exports.getChecklist = function (checklistId, callback) {
    models.Checklist.find({
        where: {
            id: checklistId
        },
        include: [
            models.Ambulance,
            {
                model: models.Compartment,
                include: models.Field
            }
        ]
    }).then(function (checklist) {
        callback(checklist);
    });
};

/**
 * method to delete a checklist by id
 * */
exports.deleteChecklist = function (checklistId, callback) {
    models.Checklist.find({
        where: {
            id: checklistId
        }
    }).then(function (checklist) {
        //console.log(checklist);
        if (checklist) {

            models.Compartment.findAll({where: {checklistId: checklist.id}}).then(function (compartments) {
                //delete the compartments
                if (compartments) {
                    for (var i = 0; i < compartments.length; i++) {
                        var compartment = compartments[i];
                        compartment.destroy();
                    }
                }

                // delete the fields
                models.Field.findAll({where: {checklistId: checklist.id}}).then(function (fields) {
                    if (fields) {
                        for (var i = 0; i < fields.length; i++) {
                            var field = fields[i];
                            field.destroy();
                        }
                    }

                    //do this last
                    checklist.destroy().then(callback);
                });
            });
        } else {
            callback(null);
        }
    });
};

/**
 * method to create a new compartment in a checklist
 * */
exports.createCompartment = function (newData, callback) {
    models.Compartment.create({
        checklistId: newData.checklistId,
        name: newData.name
    }).then(function (compartment) {
        if (compartment) {
            callback(compartment);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all compartments of a checklist
 * */
exports.getAllCompartments = function (checklistId, callback) {
    models.Compartment.findAll({
        where: {
            checklistId: checklistId
        }
    }).then(function (compartments) {
        console.log(compartments);
        if (compartments) {
            callback(compartments);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get a compartment by id
 * */
exports.getCompartment = function (compartmentId, callback) {
    models.Compartment.find({
        where: {
            id: compartmentId
        }
    }).then(function (compartment) {
        console.log(compartment);
        if (compartment) {
            callback(compartment);
        } else {
            callback(null);
        }
    });
};

/**
 * method to delete a compartment
 * */
exports.deleteCompartment = function (checklistId, compartmentId, callback) {
    models.Compartment.destroy({
        where: {
            id: compartmentId,
            checklistId: checklistId
        },
        //include the fields too
        include: models.Fields
    }).then(function (affectedRows) {
        //console.log(affectedRows);
        callback(affectedRows);
    });
};

/**
 * method to add a new field in a compartment
 * */
exports.createField = function (newData, callback) {
    models.Field.create({
        name: newData.name,
        compartmentId: newData.compartmentId,
        checklistId: newData.checklistId
    }).then(function (compartment) {
        if (compartment) {
            callback(compartment);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all fields for a compartment
 * */
exports.getAllFields = function (compartmentId, callback) {
    models.Field.findAll({
        where: {
            compartmentId: compartmentId
        }
    }).then(function (fields) {
        console.log(fields);
        if (fields) {
            callback(fields);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get a field by id
 * */
exports.getField = function (fieldId, callback) {
    models.Field.find({
        where: {
            id: fieldId
        }
    }).then(function (field) {
        //console.log(field);
        if (field) {
            callback(field);
        } else {
            callback(null);
        }
    });
};

/**
 * method to delete a field
 * */
exports.deleteField = function (checklistId, compartmentId, fieldId, callback) {
    models.Field.find({
        where: {
            id: fieldId,
            compartmentId: compartmentId,
            checklistId: checklistId
        }
    }).then(function (field) {
        //console.log(field);
        if (field) {
            field.destroy().then(callback);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all users of an ambulanceSquad
 * */
exports.getAllUsers = function (squadId, callback) {
    models.User.findAll({
        where: {
            ambulanceSquadId: squadId
        },
        attributes: ['id', 'first', 'last', 'email', 'phone', 'username', 'role']
    }).then(function (squad) {
        if (squad) {
            callback(squad);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get an ambulanceSquad with the users that belong to it excluding the currently signed in user
 * */
exports.getAmbulanceSquad = function (currentUserId, squadId, callback) {
    models.AmbulanceSquad.find({
        where: {
            id: squadId
        },
        include: {
            model: models.User,
            attributes: ['id', 'first', 'last', 'email', 'phone', 'username', 'role']
        }
    }).then(function (squad) {
        if (squad) {

            //loop through and remove the current user
            var Users = squad.Users;
            for (var i = 0; i < Users.length; i++) {
                var user = Users[i];
                //console.log(user.id);
                if (user.id === currentUserId) {
                    delete Users[i];
                }
            }

            callback(squad);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get an ambulanceSquad
 * */
exports.getAmbulanceSquadOnly = function (squadId, callback) {
    models.AmbulanceSquad.find({
        where: {
            id: squadId
        }
    }).then(function (squad) {
        if (squad) {
            callback(squad);
        } else {
            callback(null);
        }
    });
};

/**
 * method to update an ambulanceSquad
 * */
exports.updateAmbulanceSquad = function (squadId, newData, callback) {
    models.AmbulanceSquad.find({
        where: {
            id: squadId
        }
    }).then(function (squad) {
        if (squad) {

            squad.squadNumber = newData.squadNumber;
            squad.name = newData.name;
            squad.street = newData.street;
            squad.city = newData.city;
            squad.state = newData.state;
            squad.zip = newData.zip;
            squad.phone = newData.phone;
            squad.companyName = newData.companyName;

            squad.save().then(function (updatedSquad) {
                if (updatedSquad) {
                    callback(updatedSquad);
                } else {
                    callback(null);
                }
            });
        } else {
            callback(null);
        }
    });
};

/**
 * method to create an ambulanceSquad user
 * */
exports.createSquadUser = function (newData, callback) {
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
            //console.log(user);
            if (user.username === newData.username) {
                callback(null, 'username-taken');
            } else if (user.email === newData.email) {
                callback(null, 'email-taken');
            }
        } else {
            encrypt.saltAndHash(newData.password, function (hash) {
                newData.password = hash;
                models.User.create({
                    first: newData.first,
                    last: newData.last,
                    email: newData.email,
                    phone: newData.phone,
                    username: newData.username,
                    password: newData.password,
                    role: newData.role,
                    ambulanceSquadId: newData.ambulanceSquadId
                }).then(function (newUser) {
                    if (newUser) {
                        callback(newUser, null);
                    } else {
                        callback(null, 'error-creating-user');
                    }
                })
            });
        }
    });
};

/**
 * method to delete an ambulanceSquad user
 * */
exports.deleteSquadUser = function (userId, callback) {
    models.User.find({
        where: {
            id: userId
        }
    }).then(function (user) {
        if (user) {
            user.destroy().then(callback);
        } else {
            callback(null);
        }
    });
};

/**
 * method to get all the rigchecks done by a user
 * */
exports.getAllRigchecks = function (userId, squadId, callback) {
    models.RigCheck.findAll({
        where: {
            ambulanceSquadId: squadId,
            userId: userId
        },
        include: [
            {
                model: models.Checklist,
                include: models.Ambulance
            },
            //{model: models.User, attributes: ['id', 'first', 'last',  'role']}
        ],
        order: 'updatedAt DESC'
    }).then(function (rigchecks) {
        callback(rigchecks);
    });
};

/**
 * method to get the rigchecks done by id and the user that did the rigcheck
 * */
exports.getRigcheck = function (rigcheckId, callback) {
    models.RigCheck.find({
        where: {
            id: rigcheckId
        },
        include: [
            {
                model: models.Checklist,
                include: [
                    {model: models.Ambulance},
                    {
                        model: models.Compartment,
                        include: [{
                            model: models.Field,
                            include: {
                                model: models.FieldValues,
                                where: {rigcheckId: rigcheckId}
                            }
                        }]
                    }
                ],
                attributes: ['title']
            },
            {model: models.User, attributes: ['id', 'first', 'last', 'role']}
        ],
    }).then(function (rigchecks) {
        callback(rigchecks);
    });
};

/**
 * method to create a rigcheck
 * */
exports.createRigcheck = function (newData, callback) {
    console.log(newData);
    models.RigCheck.create({
        ambulanceSquadId: newData.ambulanceSquadId,
        userId: newData.userId,
        comment: newData.comment,
        checklistId: newData.checklistId
    }).then(function (rigcheck) {
        for (var i = 0; i < newData.fieldValues.length; i++) {
            var fieldValue = newData.fieldValues[i];

            models.FieldValues.create({
                checklistId: fieldValue.checklistId,
                compartmentId: fieldValue.compartmentId,
                fieldId: fieldValue.fieldId,
                rigCheckId: rigcheck.id,
                value: fieldValue.isSelected
            });

        }
        callback(rigcheck);
    });
};
