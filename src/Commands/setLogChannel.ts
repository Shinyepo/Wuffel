import { CommandType } from "../../types";
import { setLogChannel } from "../Services/LogsService";
import { ExtractId } from "../Utilities/idExtractor";

export = {
  data: {
    name: "setLogChannel",
    description: "Set a channel, for a event, to which logs will be sent.",
  },
  permissionLevel: "owner",
  async execute(client, message, eventName, channel) {
    if (!message.guild) return null;
    const extractedChannel = await ExtractId(message.guild, channel, "channel");
    if (!extractedChannel)
      return message.reply("You didnt provide a valid channel");

    const channelId =
      message.mentions.channels.first()?.id ?? extractedChannel.id;
      
    const result = await setLogChannel(
      client.em,
      message.guild.id,
      eventName,
      channelId
    );

    if (result) {
      return await message.reply(
        `Successfully set ${channel} for ${eventName} `
      );
    }
    return await message.reply(
      "Something went wrong while setting channel for " + eventName
    );
  },
} as CommandType;
