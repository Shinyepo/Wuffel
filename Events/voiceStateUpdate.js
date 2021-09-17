module.exports = {
    name: 'voiceStateUpdate',
    on: true,
    /**
    * @param {Client} client Current Discord client
    * @param {GuildMember} oldState Guild member's voice state before change.
    * @param {GuildMember} newState Guild member's voice state after change.
    */
    async execute(client, oldState, newState) {
        // console.log(oldState);
        // console.log(newState);
        // const user = oldState.guild.members.cache.get(oldState.id);
        // console.log(user.presence.activities);

        const user = client.users.cache.get(oldState.id);
            console.log(user.presence);
    },
};