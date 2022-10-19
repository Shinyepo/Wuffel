import { GuildMember, TextBasedChannel } from "discord.js";
import { addTraffic } from "../Services/TrafficService";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildMemberAdd",
  on: true,
  async execute(client: WuffelClient, member: GuildMember) {
    await addTraffic(client.em, member, true);
    console.log("Added new traffic");

    const settings = await getLogSettings(
      client.em,
      member.guild,
      "guildEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;

    const logChannel = member.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;

    const avatar = member.avatarURL() ?? member.displayAvatarURL();
      const em = new InfoEmbed(client)
        .setColor("Green")
        .setTitle("A user joined the server")
        .setThumbnail(avatar)
        .addFields({ name: "User", value: member.toString() });

      return await logChannel.send({ embeds: [em] });

  },
} as EventType;
