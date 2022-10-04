import { AuditLogEvent, GuildBan, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildBanRemove",
  on: true,
  async execute(client: WuffelClient, ban: GuildBan) {
    const settings = await getLogSettings(client.em, ban.guild, "guildEvents");

    if (!settings || !settings.on || !settings.channel) return null;

    const logChannel = ban.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;
    const { user, reason, guild } = await ban;

    const embed = new InfoEmbed(client)
      .setColor("Green")
      .setTitle("User was unbanned")
      .setThumbnail(
        user.displayAvatarURL({ forceStatic: false }) ?? user.defaultAvatarURL
      )
      .addFields({name: "User",value: user.toString(), inline: true});

      const audit = await fetchAudit(guild, AuditLogEvent.MemberBanRemove);
      if (audit?.executor && audit.target) {
        if ((audit?.target as User).id === user.id)
          embed.addFields({name: "Deleted by",value: audit!.executor!.toString()});
      }
    
    embed.addFields({name: "Reason",value: reason ? reason : "*not specified*"});

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
