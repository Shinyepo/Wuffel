const { MessageEmbed, Message } = require('discord.js');

class InfoEmbed extends MessageEmbed {
    /**
     * @param {Message} message
     */
    constructor(message, data = {}) {
        super(data);
        this.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL() ?? message.author.defaultAvatarURL());
        this.setColor('#B1FFFD');
    }
}

class LeaderboardEmbed extends MessageEmbed {
    /**
     * @param {Message} message
     */
    constructor(message, data = {}) {
        super(data);
        this.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL() ?? message.author.defaultAvatarURL());
        this.setImage('https://discord.com/assets/0a00e865c445d42dfb9f64bedfab8cf8.svg');
        this.setColor('#FFEF78');
    }
}

module.exports = { InfoEmbed, LeaderboardEmbed };