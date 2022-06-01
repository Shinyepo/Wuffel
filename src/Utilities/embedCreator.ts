import { Message, MessageEmbed } from "discord.js";

export class InfoEmbed extends MessageEmbed {
  constructor(message: Message, data = {}) {
    super(data);
    this.setAuthor(
      message.author.username + "#" + message.author.discriminator,
      message.author.avatarURL() ?? message.author.defaultAvatarURL
    );
    this.setColor("#B1FFFD");
  }
}

export class LeaderboardEmbed extends MessageEmbed {
  constructor(message: Message, data = {}) {
    super(data);
    this.setAuthor({
      name: message.author.username + "#" + message.author.discriminator,
      iconURL: message.author.avatarURL() ?? message.author.defaultAvatarURL,
    });
    this.setImage(
      "https://discord.com/assets/0a00e865c445d42dfb9f64bedfab8cf8.svg"
    );
    this.setColor("#FFEF78");
  }
}
