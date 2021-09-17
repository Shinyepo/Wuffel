const { APIMessage } = require('discord-api-types');
const { Client } = require('discord.js');

module.exports = {
    data: {
        name: 'esp',
        description: 'Gowno do robienia gowna :)',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {APIMessage} message Message from Command Handler
     */
    async execute(client, message) {
        client.emit(message.content, message.author, message.author);

    },
};

