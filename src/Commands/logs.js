const { Client, Message } = require('discord.js');
const mongoose = require('mongoose');
const { GuildInformation, Logs } = require('../Database/connection');
const { getLogKeys, getLogs } = require('../Database/dbUtilities');

module.exports = {
    data: {
        name: 'logs',
        aliases: ['events', 'log'],
        description: 'Configure channels for logs',
    },
    /**
     * @param {Client} client Current Discord client
     * @param {Message} message Message from Command Handler
     * @param {String} args Arguments in string format
     */
    async execute(client, message, args) {
        if (args.length === 0) {
            let names = '';
            const docFields = Object.keys(Logs.schema.paths);
            docFields.forEach(field => {
                if (field !== 'guildId' && field !== '__v' && field !== '_id') {
                    names += field + '\n';
                }
            });
            
            const configuredLogs = await getLogs(message.guild);
            const d = configuredLogs.map().get(docFields[0]);
            configuredLogs.forEach(log => {
                console.log(log);
            });
            console.log(configuredLogs);
            console.log(names);
        }
    },
};