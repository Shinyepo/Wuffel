'use strict';

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { guildId, applicationId, token } = require('./config.json');
const { Routes } = require('discord-api-types/v9');

const commands = [];

const commandFiles = fs.readdirSync('./SlashCommands').filter(x=> x.endsWith('.js'));
const commandNames = [];
for (const file of commandFiles) {
	const command = require(`./SlashCommands/${file}`);
    commandNames.push(command.data.name);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: 9 }).setToken(token);

let readyString = '';

for (const name of commandNames) {
    readyString += name + '\n';
}

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commands },
        );

        console.log('Successfully deployed following commands.\n' + readyString);
    }
    catch (error) {
        console.log(error);
    }
})();