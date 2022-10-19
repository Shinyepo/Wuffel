import {
  addStreamerRanking,
  insertStartedStream,
} from "../Services/StreamerService";
import { EventType, WuffelClient } from "../../types";
import { AuditLogEvent, ChannelType, User, VoiceState } from "discord.js";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";
import { fetchAudit } from "../Utilities/auditFetcher";

export = {
  name: "voiceStateUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    oldState: VoiceState,
    newState: VoiceState
  ) {
    if (oldState.streaming !== newState.streaming) {
      if (newState.streaming === true) {
        return await insertStartedStream(client.em, newState);
      } else {
        return await addStreamerRanking(client.em, newState);
      }
    }

    const settings = await getLogSettings(
      client.em,
      newState.guild,
      "voicePresenceEvents"
    );

    if (!settings || !settings.on || !settings.channel) return;

    const logChannel = newState.guild.channels.cache.find(
      (x) => x.id === settings.channel
    );

    if (!logChannel || logChannel.type !== ChannelType.GuildText) return;

    const embed = new InfoEmbed(client)
      .setTitle("Voice presence change")
      .addFields({
        name: "Affected user",
        value: newState.member?.toString() ?? "*missing user*",
        inline: false,
      })
      .setColor("Red");
    let n = 0;

    if (oldState.serverDeaf !== newState.serverDeaf) {
      const audit = await fetchAudit(
        newState.guild,
        AuditLogEvent.MemberUpdate
      );
      if ((audit?.target as User).id === newState.member?.id) {
        if (audit!.changes.find((x) => x.key === "deaf")) {
          embed
            .addFields({
              name: "Changed by*",
              value: audit!.executor!.toString(),
              inline: true,
            })
            .setFooter({ text: "*this might not be accurate" });
        }
      }

      if (newState.serverDeaf) {
        embed.setDescription("A user has been deafened");
      } else {
        embed.setDescription("A user has been undeafened").setColor("Green");
      }
      n++;
    }
    if (oldState.serverMute !== newState.serverMute) {
      const audit = await fetchAudit(
        newState.guild,
        AuditLogEvent.MemberUpdate
      );
      if ((audit?.target as User).id === newState.member?.id) {
        if (audit!.changes.find((x) => x.key === "mute")) {
          embed
            .addFields({
              name: "Changed by*",
              value: audit!.executor!.toString(),
              inline: true,
            })
            .setFooter({ text: "*this might not be accurate" });
        }
      }
      if (newState.serverMute) {
        embed.setDescription("A user has been muted");
      } else {
        embed.setDescription("A user has been unmuted").setColor("Green");
      }
      n++;
    }
    if (oldState.channel !== newState.channel) {
      if (oldState.channel && newState.channel === null) {
        embed
          .setDescription("User left the channel")
          .addFields({
            name: "Last channel",
            value: oldState.channel.toString(),
            inline: true,
          })
          .setColor("Grey");
      } else if (oldState.channel && newState.channel) {
        const audit = await fetchAudit(
          newState.guild,
          AuditLogEvent.MemberMove
        );
        const currTime = new Date().getTime();
        const diff = currTime - audit!.createdTimestamp;
        console.log({curr: new Date(currTime), audit: new Date(audit!.createdTimestamp)});
        
        console.log({diff});
        
        if (diff < 45000 && diff > -45000) {
          console.log(true);
          
          embed
            .addFields({
              name: "Moved by*",
              value: audit!.executor!.toString(),
              inline: true,
            })
            .setFooter({ text: "*this might not be accurate" });
        }
        embed
          .setDescription("User changed channels")
          .addFields(
            {
              name: "Last channel",
              value: oldState.channel.toString(),
              inline: true,
            },
            {
              name: "New channel",
              value: newState.channel.toString(),
              inline: true,
            }
          )
          .setColor("Blue");
      } else if (oldState.channel === null && newState.channel) {
        embed
          .setDescription("User joined channel")
          .addFields({
            name: "New channel",
            value: newState.channel.toString(),
            inline: true,
          })
          .setColor("Green");
      }
      n++;
    }

    if (n < 1) return;

    return await logChannel.send({ embeds: [embed] });
  },
} as EventType;
