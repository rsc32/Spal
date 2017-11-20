/**
 * Created by deep on 11/29/16.
 * data model for a rig check
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var RigCheck = sequelize.define('RigCheck', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        //id of the checklist that is associated with the
        checklistId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        //id of the ambulance that this rigcheck belongs to
        ambulanceSquadId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        //comment that is at the end
        comment: {
            allowNull: false,
            type: DataTypes.STRING(1200),
            defaultValue: ""
        },
        //id of the user that has performed the rig check
        userId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW
        }
    }, {
        classMethods: {
            associate: function (models) {
                RigCheck.belongsTo(models.Checklist, {
                    foreignKey: 'checklistId'
                });

                RigCheck.hasMany(models.FieldValues, {
                    foreignKey: 'rigCheckId',
                    onDelete: 'cascade'
                });

                RigCheck.belongsTo(models.User, {
                    foreignKey: 'userId'
                });
            }
        },
        // add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        //freezeTableName: true,

        // define the table's name
        tableName: 'RigCheck'
    }, {
        dialect: 'mysql'
    });

    return RigCheck;
};