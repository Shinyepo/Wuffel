'use strict';

// Require the necessary discord.js classes
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const { token } = require('./config.json');
const { consoleTimestamp } = require('./Utilities/timestamp');


// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./SlashCommands').filter(x=> x.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./SlashCommands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(consoleTimestamp() + ' Successfully loaded command - ' + command.data.name);

}

const eventFiles = fs.readdirSync('./Events').filter(x=>x.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./Events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log(consoleTimestamp() + ' Successfully loaded event - ' + event.name);
}

// When the client is ready, run this code (only once)
// client.once('ready', () => {
// 	console.log('Ready!');
// });

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.log(error);

	}
});

// Login to Discord with your client's token
client.login(token);