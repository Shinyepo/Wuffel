import { ChannelType, GuildChannel, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { permDiff } from "../Utilities/arrayDifference";
import { InfoEmbed } from "../Utilities/embedCreator";

const keyArray: { [key: string]: string } = {
  nsfw: "NSFW",
  name: "Old Name",
  topic: "Old Topic",
  userLimit: "User Limit",
  defaultAutoArchiveDuration: "Archivization Time",
  rateLimitPerUser: "Slowmode",
  rtcRegion: "Region",
  bitrate: "Bitrate",
  videoQualityMode: "Video Quality",
  parentId: "Old Category",
  rawPosition: "Order",
};

const archiveTime: { [key: number]: string } = {
  60: "1 Hour",
  1440: "1 Day",
  4320: "3 Days",
  10080: "1 Week",
};

const slowmode: { [key: number]: string } = {
  5: "5s",
  10: "10s",
  15: "15s",
  30: "30s",
  60: "1min",
  120: "2min",
  300: "5min",
  600: "10min",
  900: "15min",
  1800: "30min",
  3600: "1h",
  7200: "2h",
  2160: "6h",
};

const videoQuality: { [key: string]: string } = {
  FULL: "720p",
  AUTO: "Auto",
};

export = {
  name: "channelUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    logChannel: TextBasedChannel,
    oldChannel: GuildChannel,
    newChannel: GuildChannel
  ) {
    const chType =
      oldChannel.type === ChannelType.GuildStageVoice
        ? "🏟️"
        : oldChannel.type === ChannelType.GuildCategory
        ? "🔖"
        : oldChannel.type === ChannelType.GuildVoice
        ? "🔊"
        : "🗒️";

    const embed = new InfoEmbed(client)
      .setTitle("A Channel was Updated.")
      .addFields(
        { name: "Type", value: chType, inline: true },
        { name: "Channel", value: newChannel.toString(), inline: true },
        {
          name: "Category",
          value: newChannel.parent?.name ?? "-",
          inline: true,
        }
      );

    for (let [key, value] of Object.entries(oldChannel)) {
      const newValue = (newChannel as any)[key];

      if (value !== newValue) {
        let parsedValue = "";

        if (key === "rawPosition") {
          parsedValue = "Changed order of the channels in the category.";
        }
        if (key === "permissionOverwrites") continue;

        if (key === "defaultAutoArchiveDuration") {
          parsedValue =
            archiveTime[value] + " -> **" + archiveTime[newValue] + "**";
        }
        if (key === "bitrate") {
          parsedValue =
            value / 1000 + "kbps -> **" + newValue / 1000 + "kbps**";
        }
        if (key === "videoQualityMode") {
          parsedValue =
            videoQuality[value] + " -> **" + videoQuality[newValue] + "**";
        }
        if (key === "rtcRegion") {
          parsedValue =
            (value === null ? "Automatic" : value) +
            " -> **" +
            (newValue === null ? "Automatic" : newValue) +
            "**";
        }
        if (key === "rateLimitPerUser") {
          parsedValue =
            (slowmode[value] === undefined ? "off" : slowmode[value]) +
            " -> **" +
            (slowmode[newValue] === undefined ? "off" : slowmode[newValue]) +
            "**";
        }
        if (key === "name" || key === "topic") {
          if (value === undefined || value === null) value = "*not set*";

          parsedValue =
            (value as string).length > 100
              ? (value as string).substring(0, 99) + "..."
              : value;
        }
        if (key === "parentId") {
          parsedValue =
            oldChannel.parent?.name === undefined
              ? "-"
              : oldChannel.parent.name;
        }
        embed.addFields({
          name: keyArray[key],
          value:
            parsedValue === ""
              ? ((value as string).length > 100
                  ? (value as string).substring(0, 99) + "..."
                  : value) +
                " -> **" +
                ((newValue as string).length > 100
                  ? (newValue as string).substring(0, 99) + "..."
                  : newValue) +
                "**"
              : parsedValue,
          inline: true,
        });
      }
    }
    const res = permDiff(
      oldChannel.permissionOverwrites.cache,
      newChannel.permissionOverwrites.cache
    );

    if (res.size > 0)
      embed.addFields({
        name: "Permissions",
        value: "Permission change.",
        inline: true,
      });

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
