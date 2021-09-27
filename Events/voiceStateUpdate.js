const { VoiceState } = require('discord.js');
const { insertStartedStream, addStreamerRanking } = require('../Database/dbUtilities');

module.exports = {
    name: 'voiceStateUpdate',
    on: true,
    /**
    * @param {Client} client Current Discord client
    * @param {VoiceState} oldState Guild member's voice state before change.
    * @param {VoiceState} newState Guild member's voice state after change.
    */
    async execute(client, oldState, newState) {
        if (oldState.streaming !== newState.streaming) {
            if (newState.streaming === true) {
                await insertStartedStream(newState.guild, newState.member);
            }
            else {
                await addStreamerRanking(newState.guild, newState.member);
            }
        }
    },
};