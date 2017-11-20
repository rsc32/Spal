/**
 * Created by deep on 11/14/16.
 * data model for an ambulance that belongs to an ambulance squad
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Ambulance = sequelize.define('Ambulance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        make: {
            type: DataTypes.STRING
        },
        model: {
            type: DataTypes.STRING
        },
        color: {
            type: DataTypes.STRING
        },
        licensePlate: {
            type: DataTypes.STRING
        },
        truckNumber: {
            type: DataTypes.STRING
        },
        ambulanceSquadId: {
            defaultValue: null,
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
                Ambulance.hasMany(models.Checklist, {
                    foreignKey: 'ambulanceId'
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
        tableName: 'Ambulance'
    }, {
        dialect: 'mysql'
    });

    return Ambulance;
};