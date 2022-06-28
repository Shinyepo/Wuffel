import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types/v10";
import { GuildTextBasedChannel, MessageResolvable } from "discord.js";
import { SlashCommandType } from "../../types";

export = {
  data: new SlashCommandBuilder()
    .setName("prune")
    .setDescription("Delete messages in bulk from a channel.")
    .setDefaultMemberPermissions(0)
    .addIntegerOption((x) =>
      x
        .setName("count")
        .setDescription("Number of messages to delete 1-99")
        .setMinValue(1)
        .setMaxValue(99)
        .setRequired(true)
    )
    .addUserOption((x) =>
      x.setName("target").setDescription("Choose a user").setRequired(false)
    )
    .addChannelOption((x) =>
      x
        .setName("channel")
        .setDescription("Choose a channel on which to delete messages")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .setDMPermission(false),
  async execute(_, interaction) {
    const count = interaction.options.getInteger("count");
    let channel = interaction.options.getChannel(
      "channel"
    ) as GuildTextBasedChannel;
    const user = interaction.options.getUser("target");

    if (!channel) channel = interaction.channel! as GuildTextBasedChannel;

    if (user) {
      let messagesToDelete: MessageResolvable[] = [];
      let lastId = "0";
      let forceBreak = false;
      let date = new Date();
      date.setDate(date.getDate() - 13);
      let messages = await channel.messages.fetch({
        limit: 100,
      });

      while (messagesToDelete.length < count!) {
        if (lastId !== "0") {
          messages = await channel.messages.fetch({
            limit: 100,
            before: lastId,
          });
          if (messages.size < 1) {
            forceBreak = true;
            break;
          }
        }

        for (const [_, message] of messages) {
          if (!message.author || message.createdTimestamp < date.getTime()) {
            forceBreak = true;
            break;
          }
          if (messagesToDelete.length < count!) {
            if (message.author.id === user.id) {
              messagesToDelete.push(message);
              lastId = message.id;
              continue;
            }
            lastId = message.id;
            continue;
          }
          break;
        }
        if (forceBreak) break;
      }

      if (messagesToDelete.length < 1) {
        return await interaction.reply({
          content: "Could not find messages to delete with specified criteria.",
          ephemeral: true,
        });
      }
      await channel.bulkDelete(messagesToDelete);

      return await interaction.reply({
        content:
          !forceBreak && messagesToDelete.length !== 0
            ? "Deleted a total of " + messagesToDelete.length
            : "Could not find messages to delete with specified criteria.",
        ephemeral: true,
      });
    }

    const done = await channel.bulkDelete(count!);

    await interaction.reply({
      content: "Deleted a total of " + done.size,
      ephemeral: true,
    });
  },
} as SlashCommandType;
