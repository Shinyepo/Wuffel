const { consoleTimestamp } = require('../Utilities/timestamp');
const { connection } = require('../Configuration/Sequelize');

module.exports = {
    name: 'ready',
    once : true,
    execute(client) {

        // ------------ Syncing Models with Database------------

        console.log(consoleTimestamp() + ' Syncing ORM with database...');

        // connection.models.GuildInformation.sync();
        connection.sync();

        console.log(consoleTimestamp() + ' Finished syncing ORM.');
        // ------------------------- = -------------------------

        console.log(consoleTimestamp() + ' Logged in as ' + client.user.tag);
    },
};