import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";
import { SlashCommandType } from "Wuffel/types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Display avatar of a specified user")
    .addUserOption((x) =>
      x
        .setName("user")
        .setDescription("Whose avatar do you want to see?")
        .setRequired(false)
    ),
  async execute(client, interaction) {
    let user = interaction.options.getUser("user");
    if (!user) user = interaction.user;

    const member = interaction.guild?.members.cache.find(
      (x) => x.id === user?.id
    );

    const avatar =
      member!.displayAvatarURL({ dynamic: true }) !== null
        ? member?.displayAvatarURL({ dynamic: true })
        : user.displayAvatarURL({ dynamic: true }) ?? user.defaultAvatarURL;

    const embed = new InfoEmbed(client)
      .setTitle((member?.nickname ?? user.username) + "'s avatar")
      .setImage(avatar + "?size=512");

    const cutLink = avatar?.replace(".webp", "").replace(".gif", "");

    const comp = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel("PNG")
        .setStyle("LINK")
        .setURL(cutLink + ".png"),
      new MessageButton()
        .setLabel("JPG")
        .setStyle("LINK")
        .setURL(cutLink + ".jpg"),
      new MessageButton()
        .setLabel("GIF")
        .setStyle("LINK")
        .setURL(cutLink + ".gif")
    );

    return await interaction.reply({ embeds: [embed], components: [comp] });
  },
} as SlashCommandType;
