import { Guild, Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { fetchAudit } from "../Utilities/auditFetcher";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "inviteDelete",
  on: true,
  async execute(client: WuffelClient, invite: Invite) {
    const guild = invite.guild as Guild;
    const settings = await getLogSettings(client.em, guild, "guildEvents");

    if (!settings || !settings.on || !settings.channel) return null;

    const logChannel = guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

    const embed = new InfoEmbed(client)
      .setTitle("A invite link was deleted")
      .setColor("RED")
      .addField("Link", invite.toString(), true)
      .addField("Target channel", invite.channel.toString(), true);

      const audit = await fetchAudit(guild, "INVITE_DELETE");
      if (audit?.executor && audit.target) {
        if ((audit?.target as Invite).code === invite.code)
          embed.addField("Deleted by", audit!.executor!.toString());
      }

    return await logChannel.send({ embeds: [embed] });
  },
} as EventType;
