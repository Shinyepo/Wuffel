const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check API Latency.'),
    async execute(interaction) {
        console.log(interaction);
        const latency = interaction.client.ws.ping;

		await interaction.reply('API Latency is ' + latency + 'ms 🏓');
    },
};