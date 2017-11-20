/**
 * Created by deep on 11/14/16.
 * model class for a checklist
 * a checklist is only associated with one ambulance and one squad
 * a checklist can have many compartments to it
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Checklist = sequelize.define('Checklist', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ambulanceId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        ambulanceSquadId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING
        }
    }, {
        classMethods: {
            associate: function (models) {
                Checklist.hasMany(models.Compartment, {
                    foreignKey: 'checklistId'
                });

                Checklist.hasMany(models.Field, {
                    foreignKey: 'checklistId'
                });

                Checklist.hasMany(models.FieldValues, {
                    foreignKey: 'checklistId'
                });

                Checklist.belongsTo(models.Ambulance, {
                    foreignKey: 'ambulanceId'
                });

                Checklist.belongsTo(models.AmbulanceSquad, {
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
        tableName: 'Checklist'
    }, {
        dialect: 'mysql'
    });

    return Checklist;
};