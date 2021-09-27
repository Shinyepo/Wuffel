const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
        name: 'messageCreate',
        on: true,
        /**
        * @param {Client} client Current Discord client
        * @param {Message} message Message assosiated with the evvent.
        */
        async execute(client, message) {
                if (message.author.bot) return;

                if (message.content.indexOf(client.config.prefix) !== 0) return;

                const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
                const commandName = args.shift().toLowerCase();

                const command = client.commands.get(commandName);

                if (!command) return;

                command.execute(client, message, args);
        },
};