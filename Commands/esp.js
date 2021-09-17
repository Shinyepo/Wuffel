const { Client, Message } = require('discord.js');

module.exports = {
    data: {
        name: 'esp',
        description: 'Gowno do robienia gowna :)',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     */
    async execute(client, message) {
        client.emit(message.content, message.author, message.author);
        // empty comment 12

    },
};

