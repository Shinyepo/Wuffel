import {
  GuildChannel,
  TextBasedChannel,
} from "discord.js";
import { EventType, WuffelClient } from "Wuffel/types";
import { getLogSettings } from "../Services/LogsService";
import {  permDiff } from "../Utilities/arrayDifference";
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
    oldChannel: GuildChannel,
    newChannel: GuildChannel
  ) {
    if (!oldChannel.guild) return null;
    const settings = await getLogSettings(
      client.em,
      oldChannel.guild,
      "channelEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const chType =
      oldChannel.type === "GUILD_STAGE_VOICE"
        ? "🏟️"
        : oldChannel.type === "GUILD_CATEGORY"
        ? "🔖"
        : oldChannel.type === "GUILD_VOICE"
        ? "🔊"
        : "🗒️";

    const embed = new InfoEmbed(client)
      .setTitle("A Channel was Updated.")
      .addField("Type", chType, true)
      .addField("Channel", newChannel.toString(), true)
      .addField("Category", newChannel.parent?.name ?? "-", true);

    for (const [key, value] of Object.entries(oldChannel)) {
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
          parsedValue = slowmode[value] + " -> **" + slowmode[newValue] + "**";
        }
        if (key === "name" || key === "topic") {
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
        embed.addField(
          keyArray[key],
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
          true
        );
      }
    }
    const res = permDiff(
      oldChannel.permissionOverwrites.cache,
      newChannel.permissionOverwrites.cache
    );

    if (res.size > 0) embed.addField("Permissions", "Permission change.", true);

    const logChannel = oldChannel.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
