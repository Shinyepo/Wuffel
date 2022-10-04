import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
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
      member!.displayAvatarURL({ forceStatic: false }) !== null
        ? member?.displayAvatarURL({ forceStatic: false })
        : user.displayAvatarURL({ forceStatic: false }) ?? user.defaultAvatarURL;

    const embed = new InfoEmbed(client)
      .setTitle((member?.nickname ?? user.username) + "'s avatar")
      .setImage(avatar + "?size=512");

    const cutLink = avatar?.replace(".webp", "").replace(".gif", "");

    const comp = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("PNG")
        .setStyle(ButtonStyle.Link)
        .setURL(cutLink + ".png"),
      new ButtonBuilder()
        .setLabel("JPG")
        .setStyle(ButtonStyle.Link)
        .setURL(cutLink + ".jpg"),
      new ButtonBuilder()
        .setLabel("GIF")
        .setStyle(ButtonStyle.Link)
        .setURL(cutLink + ".gif")
    );

    return await interaction.reply({ embeds: [embed], components: [comp] });
  },
} as SlashCommandType;
