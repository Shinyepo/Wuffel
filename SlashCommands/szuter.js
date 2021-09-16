const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('szuter')
        .setDescription('Pokaż klate!'),
    async execute(interaction) {
        const szuter = interaction.guild.members.cache.get('228556663244718080');

        interaction.reply(szuter.toString() + ' pokaż klate dla ' + interaction.user.toString());
    },
};