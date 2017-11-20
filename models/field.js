/**
 * Created by deep on 11/29/16.
 * data model for a field value inside a compartment
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Field = sequelize.define('Field', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        //name of the field
        name: {
            type: DataTypes.STRING
        },
        //id of the compartment that is associated with the
        compartmentId: {
            allowNull: false,
            type: DataTypes.INTEGER
        },
        checklistId: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
                Field.belongsTo(models.Checklist, {
                    onDelete: 'cascade',
                    foreignKey: 'checklistId'
                });

                Field.belongsTo(models.Compartment, {
                    onDelete: 'cascade',
                    foreignKey: 'compartmentId'
                });

                Field.hasMany(models.FieldValues, {
                    onDelete: 'cascade',
                    foreignKey: 'fieldId'
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
        tableName: 'Field'
    }, {
        dialect: 'mysql'
    });

    return Field;
};