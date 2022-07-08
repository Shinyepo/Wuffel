import { EmbedAuthorData } from "@discordjs/builders";
import { Message, MessageEmbed } from "discord.js";
import { WuffelClient } from "Wuffel/types";

export class InfoEmbed extends MessageEmbed {
  constructor(client: WuffelClient, message?: Message, data = {}) {
    super(data);
    let author = {
      name: client.user?.username,
      iconURL: client.user?.avatarURL(),
    } as EmbedAuthorData;
    if (message?.author)
      author = {
        name: message.author.username,
        iconURL: message.author.avatarURL() ?? undefined,
      };
    this.setAuthor(author);
    this.setColor("#f9cf93");
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
