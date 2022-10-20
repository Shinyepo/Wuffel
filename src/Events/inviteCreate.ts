import { Invite, TextBasedChannel } from "discord.js";
import { EventType, WuffelClient } from "../../types";
import { InfoEmbed } from "../Utilities/embedCreator";

export = {
  name: "inviteCreate",
  on: true,
  async execute(
    client: WuffelClient,
    logChannel: TextBasedChannel,
    invite: Invite
  ) {
    const embed = new InfoEmbed(client)
      .setTitle("New invite link was created")
      .setColor("Aqua")
      .addFields(
        { name: "Link", value: invite.toString() },
        { name: "Inviter", value: invite.inviter!.toString(), inline: true },
        {
          name: "Maximum uses",
          value: invite.maxUses!.toString(),
          inline: true,
        },
        {
          name: "Target channel",
          value: invite.channel?.toString() ?? "-",
          inline: true,
        },
        {
          name: "Expires at",
          value: invite.expiresTimestamp
            ? new Date(invite.expiresTimestamp).toString()
            : "Never",
        }
      );

    return await logChannel.send({ embeds: [embed] });
  },
} as EventType;
