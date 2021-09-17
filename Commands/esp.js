const { APIMessage } = require('discord-api-types');
const { Client } = require('discord.js');

module.exports = {
    data: {
        name: 'esp',
        description: 'Gowno do robienia gowna :)',
    },
    /**
     * @param {Client} client tak kurwa
     * @param {APIMessage} message tak nie kurwa
     */
    async execute(client, message) {
        client.emit(message.content, message.author, message.author);

    },
};

