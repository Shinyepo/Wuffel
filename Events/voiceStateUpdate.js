module.exports = {
    name: 'voiceStateUpdate',
    on: true,
    async execute(client, oldState, newState) {
        // console.log(oldState);
        // console.log(newState);
        // const user = oldState.guild.members.cache.get(oldState.id);
        // console.log(user.presence.activities);

        const user = client.users.cache.get(oldState.id);
            console.log(user.presence);
    },
};