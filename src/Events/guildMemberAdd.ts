import { GuildMember, TextBasedChannel } from "discord.js";
import { addTraffic } from "../Services/TrafficService";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "guildMemberAdd",
  on: true,
  async execute(client: WuffelClient, logChannel: TextBasedChannel, member: GuildMember) {
    await addTraffic(client.em, member, true);
    console.log("Added new traffic");

    const avatar = member.avatarURL() ?? member.displayAvatarURL();
      const em = new InfoEmbed(client)
        .setColor("Green")
        .setTitle("A user joined the server")
        .setThumbnail(avatar)
        .addFields({ name: "User", value: member.toString() });

      return await logChannel.send({ embeds: [em] });

  },
} as EventType;
