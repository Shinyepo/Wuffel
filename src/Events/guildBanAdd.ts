import { AuditLogEvent, GuildBan, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildBanAdd",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, ban: GuildBan) {
    const { user, reason, guild } = await ban.fetch();

    const embed = new InfoEmbed(client)
      .setColor("Red")
      .setTitle("A member was banned")
      .setThumbnail(
        user.displayAvatarURL({ forceStatic: false }) ?? user.defaultAvatarURL
      )
      .addFields({name: "User",value: user.toString(),inline: true});

    const audit = await fetchAudit(guild, AuditLogEvent.MemberBanAdd);
    if (audit?.executor && audit.target) {
      if ((audit?.target as User).id === user.id)
        embed.addFields({name: "Created by",value: audit!.executor!.toString()});
    }

    embed.addFields({name: "Reason",value: reason ? reason : "*not specified*"});

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
