const { Sequelize } = require('Sequelize');
const config = require('./config.json');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: '192.168.1.14',
    port: '5454',
    dialect: 'postgres',
    logging: false,
});

const GuildInformation = require('./Models/GuildInformation')(sequelize);
const Settings = require('./Models/Settings')(sequelize);


module.exports = { GuildInformation, Settings };