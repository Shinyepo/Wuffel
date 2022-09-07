import { GuildBan, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
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
      .setColor("GREEN")
      .setTitle("User was unbanned")
      .setThumbnail(
        user.displayAvatarURL({ dynamic: true }) ?? user.defaultAvatarURL
      )
      .addField("User", user.toString(), true);

    const banAudit = await (
      await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE", limit: 1 })
    ).entries.first();
    console.log("ban?" + banAudit);
    

    if (!banAudit) console.log("No audit found");
    else {
      const { executor, target } = banAudit!;
      if (target?.id === user.id) embed.addField("Executor", executor!.toString())
    }
    
    embed.addField("Reason", reason ? reason : "*not specified*");

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
