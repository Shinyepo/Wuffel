const { consoleTimestamp } = require('../Utilities/timestamp');
const { connection } = require('../Configuration/Sequelize');
const { Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once : true,
    /**
    * @param {Client} client Current Discord client
    */
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