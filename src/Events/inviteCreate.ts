import { Guild, Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { getLogSettings } from "../Services/LogsService";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "inviteCreate",
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
        .setTitle("New invite link was created")
        .setColor("AQUA")
        .addField("Link", invite.toString(), true)
        .addField("Inviter", invite.inviter!.toString(), true)
        .addField("Maximum uses", invite.maxUses!.toString(), true)
        .addField("Target channel", invite.channel.toString(), true)
        .addField("Expires at", (invite.expiresTimestamp ? new Date(invite.expiresTimestamp).toString() : "Never"));

    await logChannel.send({embeds: [embed]});
    
  },
} as EventType;
