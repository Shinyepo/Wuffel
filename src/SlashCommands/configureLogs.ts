import { SlashCommandBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, SelectMenuBuilder } from "discord.js";
import {nanoid} from "nanoid";
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

    const channelMenu = new SelectMenuBuilder()
      .setCustomId(channelId)
      .setPlaceholder("Select Channel");

    for (const channel of interaction.guild!.channels.cache.values()) {
      if (channel.type === ChannelType.GuildText) {
        channelMenu.addOptions([
          {
            label: "#" + channel.name,
            value: channel.id,
          },
        ]);
      }
    }

    const eventComp = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
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
    const channelComp = new ActionRowBuilder<SelectMenuBuilder>().addComponents(channelMenu);
    const saveComp = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(saveId)
        .setLabel("Save")
        .setStyle(ButtonStyle.Success)
    );
    let data = {
      event: "",
      channel: "",
    };

    const filterSave = (i: any) =>
      i.customId === saveId && i.user.id === interaction.user?.id;
    const filterEvent = (i: any) =>
      (i.customId === eventId || i.customId === channelId) && i.user.id === interaction.member?.user.id;

    const selectCollector =
      interaction.channel!.createMessageComponentCollector({
        componentType: ComponentType.SelectMenu,
        time: 30000,
        filter: filterEvent,
      });
    const buttonCollector =
      interaction.channel!.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30000,
        filter: filterSave,
      });

    selectCollector.on("collect", async (i) => {
      await i
        .deferUpdate({ fetchReply: false })
        .catch((err) => console.log(err));
      
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
            await i.update({
              content: `Successfully changed settings for the event`,
              embeds: [],
              components: [],
            });
            return;
          }
          await i.update({
            content:
              "Something went wrong while setting channel for the event.",
            embeds: [],
            components: [],
          });
          return;
        } else {  
          data.channel = "";
          data.event = "";
          await i.update({
            content: "**---->  Please select Event and Channel.  <----**",
          });
          return;
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
