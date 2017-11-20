/**
 * Created by deep on 11/29/16.
 * table that holds field values of the data this is only for checkable data
 * TODO add data values for fields that are not just checkable
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var FieldValues = sequelize.define('FieldValues', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        //value of the field
        checked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        //id of the compartment that is associated with the value
        compartmentId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        //id of the checklist associated with this value
        checklistId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        //id of the rig check this value belongs to
        rigCheckId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        //the field to insert the value for
        fieldId: {
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
                FieldValues.belongsTo(models.RigCheck, {
                    foreignKey: 'rigCheckId'
                });

                FieldValues.belongsTo(models.Checklist, {
                    foreignKey: 'checklistId'
                });

                FieldValues.belongsTo(models.Compartment, {
                    foreignKey: 'compartmentId'
                });

                FieldValues.belongsTo(models.Field, {
                    foreignKey: 'fieldId'
                });
            }
        },
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,

        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        //freezeTableName: true,

        // define the table's name
        tableName: 'FieldValues'
    }, {
        dialect: 'mysql'
    });

    return FieldValues;
};