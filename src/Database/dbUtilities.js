const { Guild, GuildMember } = require('discord.js');
const { GuildInformation, Settings, Logs, StartedStream, StreamerRanking } = require('./connection');
const { consoleTimestamp } = require('../Utilities/timestamp');

module.exports = {
/**
 * @param {Guild} guild guild object to update
 * @param {String} key field to update
 */
async changeSetting(guild, key, value) {
    const query = {};
    query[key] = value;
    await Settings.findOneAndUpdate({ guildId: guild.id }, query);
},
/**
 * @param {Guild} guild guild object to update
 * @param {String} key field to update
 */
async changeLogs(guild, key, value) {
    const query = {};
    query[key] = value;
    await Logs.findOneAndUpdate({ guildId: guild.id }, query);
},
/**
 * @param {Guild} guild guild object to update
 * @param {String} key field to update
 */
async getLogs(guild) {
    return await Logs.findOne({ guildId: guild.id });
},

/**
 * @param {Guild} guild guild object to update
 * @param {String} key field to update
 */
async changeGuildInformation(guild, key, value) {
    const query = {};
    query[key] = value;
    await GuildInformation.findOneAndUpdate({ guildId: guild.id }, query);
},

/**
 * @param {Guild} guild guild object to update
 * @param {String} key field to update
 */
 async getStreamerRanking(guild) {
    const leaderboard = await StreamerRanking.find({ guildId: guild.id }).sort('-timeStreamed');
    return leaderboard;
},

/**
 * @param {Guild} guild guild object to update
 * @param {GuildMember} user guild member assosiated withe the guild
 * @param {String} key field to update
 */
async insertStartedStream(guild, user) {
    const curr = new Date().getTime();
    const newEntry = new StartedStream({
        guildId: guild.id,
        userId: user.id,
        startingDate: curr,
    });
    await newEntry.save().catch((err) => {
        if (err.code === 11000) {
            StartedStream.findOneAndUpdate({ guildId: guild.id, userId: user.id }, { startingDate: curr });
        }
    });
},

/**
 * @param {Guild} guild guild object to update
 * @param {GuildMember} user guild member assosiated withe the guild
 * @param {String} key field to update
 */
 async addStreamerRanking(guild, user) {
    const startedStream = await StartedStream.findOne({ guildId: guild.id, userId: user.id }, 'startingDate');
    const startingDate = startedStream.startingDate;
    const curr = new Date().getTime();
    const time = curr - startingDate;

    await StreamerRanking.findOneAndUpdate({ guildId: guild.id, userId: user.id }, { $inc: { timeStreamed: time }, lastStream: startingDate }).then((res) => {
        if (res) {
            console.log('udalo sie');
        }
        else {
            const newEntry = new StreamerRanking({
                guildId: guild.id,
                userId: user.id,
                timeStreamed: time,
                lastStream: startingDate,
            });

            newEntry.save();
        }
    });

    await StartedStream.deleteOne({ guildId: guild.id, userId: user.id });
},

/**
 * @param {Guild} guild guild object
 */
async createDefaultSettings(guild) {
    const owner = guild.members.cache.get(guild.ownerId).user;
    const guildInformation = new GuildInformation({
        guildId: guild.id,
        guildName: guild.name,
        guildOwnerName: owner.username + '#' + owner.discriminator,
        guildOwnerId: owner.id,
        guildIcon: guild.iconURL(),
        guildBanner: guild.bannerURL(),
    });

    const settings = new Settings({
        guildId: guild.id,
        active: true,
        prefix: '+',
    });
    const logs = new Logs({
        guildId: guild.id,
    });


    await guildInformation.save().catch((err) => {
        if (err.code === 11000) {
            // console.log(consoleTimestamp() + ' GuildInformation for ' + guild.name + '(' + guild.id + ') already exists!');
        }
        else {
            console.error(err);
        }
    });
    await settings.save().catch((err) => {
        if (err.code === 11000) {
            // console.log(consoleTimestamp() + ' Settings for ' + guild.name + '(' + guild.id + ') already exist!');
            module.exports.changeSetting(guild, 'active', true);
        }
        else {
            console.error(err);
        }
    });
    await logs.save().catch((err) => {
        if (err.code === 11000) {
            // console.log(consoleTimestamp() + ' Logs for ' + guild.name + '(' + guild.id + ') already exist!');
        }
        else {
            console.error(err);
        }
    });
},
};

