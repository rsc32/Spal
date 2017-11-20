/**
 * Created by deep on 10/10/16.
 * data model class for a user
 */
"use strict";
// Create a token generator with the default settings:
var randtoken = require('rand-token');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING
        },
        //status of verification
        verificationStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        verificationCode: {
            type: DataTypes.STRING,
            defaultValue: randtoken.generate(255)
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        }
    }, {
        classMethods: {
            associate: function (models) {

            },
            validPassword: function (password, passwd, done, user) {
                bcrypt.compare(password, passwd, function (err, isMatch) {
                    if (err) {
                        console.log(err)
                    }

                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false)
                    }
                })
            }
        },
        // add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        //freezeTableName: true,

        // define the table's name
        tableName: 'User'
    }, {
        dialect: 'mysql'
    });

    return User;
};
