/**
 * Created by deep on 11/14/16.
 * model that represents a compartment in a checklist this has only one checklist
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Compartment = sequelize.define('Compartment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        //id of the checklist that the compartment is associated with
        checklistId: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
                Compartment.hasMany(models.Field, {
                    foreignKey: 'compartmentId'
                });

                Compartment.hasMany(models.FieldValues, {
                    foreignKey: 'compartmentId'
                });

                Compartment.belongsTo(models.Checklist, {
                    onDelete: 'cascade',
                    foreignKey: 'checklistId'
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
        tableName: 'Compartment'
    }, {
        dialect: 'mysql'
    });

    return Compartment;
};