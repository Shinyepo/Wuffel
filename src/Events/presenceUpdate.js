const { Client, GuildMember } = require('discord.js');

module.exports = {
    name: 'presenceUpdate',
    on: true,
    /**
    * @param {Client} client Current Discord client
    * @param {GuildMember} oldMember Guild member's presence before change.
    * @param {GuildMember} newMember Guild member's presence after change.
    */
    async execute(client, oldMember, newMember) {
        // console.log(oldMember.activities);
        // console.log(newMember.activities);
    },
};
