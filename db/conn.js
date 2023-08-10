const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('mandacaru_connection', process.env.DB_USER , process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.log(`Unable to connect to the database: ${error}`);
}

module.exports = sequelize;