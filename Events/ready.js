const { consoleTimestamp } = require('../Utilities/timestamp');
const { Client } = require('discord.js');

module.exports = {
    name: 'ready',
    once : true,
    /**
    * @param {Client} client Current Discord client
    */
    execute(client) {
        console.log(consoleTimestamp() + ' Logged in as ' + client.user.tag);
    },
};