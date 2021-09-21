// Execute this file with 'node dbInit.js' everytime you change a model
const { Sequelize } = require('sequelize');
const config = require('./config.json');

console.log('Creating connection...');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: '192.168.1.14',
    port: '5454',
    dialect: 'postgres',
    logging: false,
});

// Require all models here and pass the connection string to them.
console.log('Importing models...');
require('./Models/GuildInformation')(sequelize);
require('./Models/Settings')(sequelize);


const force = process.argv.includes('--force') || process.argv.includes('-f');

console.log('Syncing models with db...');
sequelize.sync({ force }).then(async () => {
    console.log('Finished :)');
    sequelize.close();
});
