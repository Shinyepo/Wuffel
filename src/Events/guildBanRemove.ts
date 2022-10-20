import { AuditLogEvent, GuildBan, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildBanRemove",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, ban: GuildBan) {
    const { user, reason, guild } = ban;

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
