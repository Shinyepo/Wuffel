import { GuildMember, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";
import { consoleTimestamp } from "../Utilities/timestamp";

export = {
  name: "guildMemberUpdate",
  on: true,
  async execute(
    client: WuffelClient,
    oldMember: GuildMember,
    newMember: GuildMember
  ) {
    const settings = await getLogSettings(
      client.em,
      newMember.guild,
      "userEvents"
    );

    if (!settings || !settings.on || !settings.channel) return null;
    const logChannel = newMember.guild.channels.cache.find(
      (x) => x.id === settings.channel
    ) as TextBasedChannel;
    if (!logChannel) return;
    let n = 0;

    const em = new InfoEmbed(client)
      .setTitle("A member has changed his profile")
      .setColor("Blue")
      .addFields({name: "User", value: newMember.toString(), inline: false});

    if (oldMember.nickname !== newMember.nickname) {
      em.addFields(
        {
          name: "Old nickname",
          value: oldMember.nickname ?? "*not set*",
          inline: true,
        },
        {
          name: "New nickname",
          value: newMember.nickname ?? "*not set*",
          inline: true,
        }
      );
      n++;
    }
    if (oldMember.avatarURL() !== newMember.avatarURL()) {
      em.setThumbnail(newMember.avatarURL() ?? newMember.displayAvatarURL());
      n++;
    }
    if (oldMember.roles.cache !== newMember.roles.cache) {
      console.log("role change");
    }
    if (oldMember.user.bannerURL() !== newMember.user.bannerURL()) {
      em.addFields({name: "Old banner",value: oldMember.user.bannerURL() ?? "*not set*", inline: true},
      {name: "New banner", value: newMember.user.bannerURL() ?? "*not set*", inline: true});
    }
    
    if (n < 1) {
      console.log("Only role change");
      
      return;
    }
    return await logChannel.send({ embeds: [em] });
  },
} as EventType;
