import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { SlashCommandType } from "../../types";
import { setLogChannel } from "../Services/LogsService";

export = {
  data: new SlashCommandBuilder()
    .setName("configurelogs")
    .setDescription("Configure channel for logs.")
    .setDefaultMemberPermissions(0)
    .addStringOption((x) =>
      x
        .setName("event")
        .setDescription("Choose event")
        .setRequired(true)
        .addChoices(
          {
            name: "Message Delete",
            value: "messageDelete",
          },
          {
            name: "Message Edit",
            value: "messageEdit",
          }
        )
    )
    .addChannelOption((x) =>
      x
        .setName("channel")
        .setDescription("Choose channel for logs.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .setDMPermission(false),
  async execute(client, interaction) {
    const channel = interaction.options.getChannel("channel");
    const event = interaction.options.getString("event");

    const result = await setLogChannel(
      client.em,
      interaction.guild!.id,
      event!,
      channel!.id
    );

    if (result) {
      return await interaction.reply({
        content: `Successfully changed settings for the event`,
        ephemeral: true,
      });
    }
    return await interaction.reply({
      content: "Something went wrong while setting channel for the event.",
      ephemeral: true,
    });
  },
} as SlashCommandType;
