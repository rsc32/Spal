/**
 * Created by deep on 10/20/16.
 * data model class for an ambulance squad
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var AmbulanceSquad = sequelize.define('AmbulanceSquad', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        squadNumber: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        street: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        companyName: {
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                AmbulanceSquad.hasMany(models.User, {
                    foreignKey: 'ambulanceSquadId'
                });

                AmbulanceSquad.hasMany(models.Ambulance, {
                    foreignKey: 'ambulanceSquadId'
                });

                AmbulanceSquad.hasMany(models.Checklist, {
                    foreignKey: 'ambulanceSquadId'
                });

            }
        },
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        //freezeTableName: true,

        // define the table's name
        tableName: 'AmbulanceSquad'
    }, {
        dialect: 'mysql'
    });

    return AmbulanceSquad;
};