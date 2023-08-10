const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const User = require('./User');

const Tought = db.define('tought', {

    title: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
    }

})

User.hasMany(Tought);
Tought.belongsTo(User);

module.exports = Tought;