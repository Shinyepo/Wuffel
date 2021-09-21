const { Guild, Client } = require('discord.js');
const { GuildInformation, Settings } = require('../dbObject');

module.exports = {
    /**
     * @param {Client} client bots instance.
     * @param {Guild} guild creates new instance of guild settings if it doesnt exist already.
     */
    async createNewGuild(client, guild) {
        const owner = client.users.cache.get(guild.ownerId);

        GuildInformation.findOrCreate({ where: { guildId: guild.id } }, { defaults: {
            guildId: guild.id,
            guildName: guild.name,
            guildOwnerId: owner.id,
            guildOwnerName: owner.username + '#' + owner.discriminator,
            guildAvatar: guild.iconURL(),
        } });

        Settings.findOrCreate({ where: { guildId: guild.id } }, { defaults: {
            guildId: guild.id,
        } });
    },

    /**
     * @param {Client} client bots instance.
     * @param {Guild} guild creates new instance of guild settings if it doesnt exist already.
     */
    async getGuildInformation(client, guild) {
        let response = await GuildInformation.findOne({ where: { guildId: guild.id } });
        if (!response) await module.exports.createNewGuild(client, guild);
        response = await GuildInformation.findOne({ where: { guildId: guild.id } });
        return response;
    },

    /**
     * @param {Client} client bots instance.
     * @param {Guild} guild creates new instance of guild settings if it doesnt exist already.
     */
    async getSettings(client, guild) {
        let response = await Settings.findOne({ where: { guildId: guild.id } });
        if (!response) await module.exports.createNewGuild(client, guild);
        response = await Settings.findOne({ where: { guildId: guild.id } });
        return response;
    },

    /**
     * @param {Client} client bots instance.
     * @param {Guild} guild creates new instance of guild settings if it doesnt exist already.
     */
    async setSettingsValue(client, guild, setting, value) {
        const toChange = await Settings.findOne({ attributes: [setting] }, { where: { guildId: guild.id } });
        toChange.update(setting, value);

    },
};