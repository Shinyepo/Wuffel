'use strict';

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { guildId, applicationId, token } = require('./config.json');
const { Routes } = require('discord-api-types/v9');

const commands = [];
console.time('Done in');
console.log('Fetching slash commands in \'./SlashCommands\'');

const commandFiles = fs.readdirSync('./SlashCommands').filter(x => x.endsWith('.js'));
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
console.log('Found ' + commandNames.length + ' commands.\n' + readyString);
(async () => {
    try {
        console.log('Started deploying Slash Commands...');
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commands },
        );
        console.log('Successfully deployed all commands.');
        console.timeEnd('Done in');
    }
    catch (error) {
        console.log(error);
    }
})();