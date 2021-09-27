const { Client, Message } = require('discord.js');
const mongoose = require('mongoose');
const { GuildInformation } = require('../Database/connection');

module.exports = {
    data: {
        name: 'esp',
        description: 'Testing ground',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     */
    async execute(client, message, args) {
        client.emit(args, message.guild);
    },
};