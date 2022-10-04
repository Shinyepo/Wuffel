import { EmbedAuthorData } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder, Message } from "discord.js";
import { WuffelClient } from "Wuffel/types";

export class InfoEmbed extends EmbedBuilder {
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

export class LeaderboardEmbed extends EmbedBuilder {
  constructor(interaction: ChatInputCommandInteraction, data = {}) {
    super(data);
    this.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() ?? interaction.user.defaultAvatarURL,
    });
    this.setImage(
      "https://discord.com/assets/0a00e865c445d42dfb9f64bedfab8cf8.svg"
    );
    this.setColor("#FFEF78");
  }
}
