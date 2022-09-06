import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageSelectMenu } from "discord.js";
import nanoid from "nanoid";
import { SlashCommandType } from "../../types";
import { setLogChannel } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  data: new SlashCommandBuilder()
    .setName("configurelogs")
    .setDescription("Configure channel for logs.")
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),
  async execute(client, interaction) {
    const embed = new InfoEmbed(client)
      .setTitle("Event Configurator")
      .setDescription(
        "Please select a event and desired channel from the lists below.\n\n\
        **If you want more detailed configuration please visit the [dashboard](https://www.wuffel.dev/)**"
      );
    const channelId = "channel-" + nanoid();
    const eventId = "event-" + nanoid();
    const saveId = "save-" + nanoid();
    console.log({ channelId, eventId, saveId });

    const channelMenu = new MessageSelectMenu()
      .setCustomId(channelId)
      .setPlaceholder("Select Channel");

    for (const channel of interaction.guild!.channels.cache.values()) {
      if (channel.type === "GUILD_TEXT") {
        channelMenu.addOptions([
          {
            label: "#" + channel.name,
            value: channel.id,
          },
        ]);
      }
    }

    const eventComp = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(eventId)
        .setPlaceholder("Select Event")
        .addOptions(
          {
            label: "Message Events",
            value: "messageEvents",
          },
          { label: "Channel Events", value: "channelEvents" },
          { label: "User Events", value: "userEvents" },
          { label: "Voice Presence Events", value: "voicePresenceEvents" },
          { label: "Guild(Server) Events", value: "guildEvents" },
          { label: "Emoji Events", value: "emojiEvents" }
        )
    );
    const channelComp = new MessageActionRow().addComponents(channelMenu);
    const saveComp = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(saveId)
        .setLabel("Save")
        .setStyle("SUCCESS")
    );
    let data = {
      event: "",
      channel: "",
    };

    const filterSave = (i) =>
      i.customId === saveId && i.user.id === interaction.user.id;
    const filterEvent = (i) =>
      (i.customId === eventId || i.customId === channelId) && i.user.id === interaction.member?.user.id;

    const selectCollector =
      interaction.channel!.createMessageComponentCollector({
        componentType: "SELECT_MENU",
        time: 30000,
        filter: filterEvent,
      });
    const buttonCollector =
      interaction.channel!.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 30000,
        filter: filterSave,
      });

    selectCollector.on("collect", async (i) => {
      await i
        .deferUpdate({ fetchReply: false })
        .catch((err) => console.log(err));
      console.log(i.customId);
      
      if (i.user.id === interaction.user.id) {
        if (i.customId === channelId) {
          data.channel = i.values[0];
        } else if (i.customId === eventId) {
          data.event = i.values[0];
        }
      }
    });

    buttonCollector.on("collect", async (i) => {
      if (i.user.id === interaction.user.id) {
        if (data.channel !== "" && data.event !== "") {
          const result = await setLogChannel(
            client.em,
            interaction.guild!.id,
            data.event!,
            data.channel
          );
          if (result) {
            return await i.update({
              content: `Successfully changed settings for the event`,
              embeds: [],
              components: [],
            });
          }
          return await i.update({
            content:
              "Something went wrong while setting channel for the event.",
            embeds: [],
            components: [],
          });
        } else {
          data.channel = "";
          data.event = "";
          await i.update({
            content: "**---->  Please select Event and Channel.  <----**",
          });
        }
      }
    });

    return await interaction.reply({
      embeds: [embed],
      components: [eventComp, channelComp, saveComp],
      ephemeral: true,
    });
  },
} as SlashCommandType;
