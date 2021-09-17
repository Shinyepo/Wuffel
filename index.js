'use strict';
// -------------- Requires --------------

const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const config = require('./config.json');
const { consoleTimestamp } = require('./Utilities/timestamp');

// eslint-disable-next-line no-unused-vars
const GuildInformation = require('./Models/GuildInformation');
// -------------- = --------------

console.log(consoleTimestamp() + ' Initializing bot.');
const client = new Client({
		partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_PRESENCES,
			Intents.FLAGS.GUILD_VOICE_STATES,
		],
	});
client.config = config;

// -------------- Slash Commands --------------

let start = Date.now();
client.commands = new Collection();
const slashCommandFiles = fs.readdirSync('./SlashCommands').filter(x => x.endsWith('.js'));

for (const file of slashCommandFiles) {
	const command = require(`./SlashCommands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(consoleTimestamp() + ' Successfully loaded Slash Command - ' + command.data.name);
}

let end = Date.now();
let sw = (end - start) / 1000;
console.log(consoleTimestamp() + ' Finished loading Slash Commands in ' + sw + 's\n');

// -------------- = --------------

// -------------- Commands --------------

start = Date.now();
const CommandFiles = fs.readdirSync('./Commands').filter(x => x.endsWith('.js'));

for (const file of CommandFiles) {
	const command = require(`./Commands/${file}`);
	client.commands.set(command.data.name, command);
	console.log(consoleTimestamp() + ' Successfully loaded Command - ' + command.data.name);
}

end = Date.now();
sw = (end - start) / 1000;
console.log(consoleTimestamp() + ' Finished loading Commands in ' + sw + 's\n');

// -------------- = --------------

// -------------- Events --------------

start = Date.now();
const eventFiles = fs.readdirSync('./Events').filter(x => x.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./Events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else if (event.on) {
		client.on(event.name, event.execute.bind(null, client));
		// (...args) => event.execute(...args)
	}
	console.log(consoleTimestamp() + ' Successfully loaded event - ' + event.name);
}
end = Date.now();
sw = (end - start) / 1000;
console.log(consoleTimestamp() + ' Finished loading Events in ' + sw + 's\n');

// -------------- = --------------


// -------------- Slash Command Handler --------------

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

// -------------- = --------------

client.login(config.token);

