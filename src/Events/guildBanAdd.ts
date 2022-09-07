import { GuildBan, TextBasedChannel, User } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildBanAdd",
  on: true,
  async execute(client: WuffelClient, ban: GuildBan) {
    const settings = await getLogSettings(client.em, ban.guild, "guildEvents");

    if (!settings || !settings.on || !settings.channel) return null;

    const logChannel = ban.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;
    const { user, reason, guild } = await ban.fetch();

    const embed = new InfoEmbed(client)
      .setColor("RED")
      .setTitle("A member was banned")
      .setThumbnail(
        user.displayAvatarURL({ dynamic: true }) ?? user.defaultAvatarURL
      )
      .addField("User", user.toString(), true);

    const audit = await fetchAudit(guild, "MEMBER_BAN_ADD");
    if (audit?.executor && audit.target) {
      if ((audit?.target as User).id === user.id)
        embed.addField("Created by", audit!.executor!.toString());
    }

    embed.addField("Reason", reason ? reason : "*not specified*");

    return logChannel.send({ embeds: [embed] });
  },
} as EventType;
