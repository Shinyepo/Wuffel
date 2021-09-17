const { Sequelize } = require('sequelize');
const config = require('../config.json');

module.exports = {
    connection: new Sequelize(config.database, config.username, config.password, {
        host: '192.168.1.14',
        port: '5454',
        dialect: 'postgres',
        logging: false,
    }),
};

