import {
  Guild,
  GuildChannel,
  GuildEmoji,
  GuildMember,
  Message,
  Sticker,
  TextBasedChannel,
  User,
  VoiceState,
} from "discord.js";
import {
  channelEvents,
  emojiEvents,
  EventSettings,
  guildEvents,
  messageEvents,
  userEvents,
  voicePresenceEvents,
  WuffelClient,
} from "../../types";
import { getLogSettings } from "../Services/LogsService";

export const verifyEventSettings = async (
  client: WuffelClient,
  eventName: string,
  ...args: any[]
) => {
  let guild;
  if (args[0] instanceof Guild) {
    guild = args[0];
  } else {
    guild = args[0].guild as Guild;
  }
  if (!guild) return console.log("Could not find guild");

  let event;
  if (messageEvents.indexOf(eventName) > -1)
    event = EventSettings.messageEvents;
  if (guildEvents.indexOf(eventName) > -1) event = EventSettings.guildEvents;
  if (emojiEvents.indexOf(eventName) > -1) event = EventSettings.emojiEvents;
  if (channelEvents.indexOf(eventName) > -1)
    event = EventSettings.channelEvents;
  if (userEvents.indexOf(eventName) > -1) event = EventSettings.userEvents;
  if (voicePresenceEvents.indexOf(eventName) > -1)
    event = EventSettings.voicePresenceEvents;

  if (!event) return;

  const settings = await getLogSettings(client.em, guild, event);

  if (!settings || !settings.on || !settings.channel) return null;
  if (settings.ignored) {
    const res = fetchId(args);
    let ignore = false;
    if (
      res.channel.length > 0 &&
      settings.ignored.channels &&
      settings.ignored.channels.length > 0
    ) {
      res.channel.forEach((x) => {
        if (settings.ignored!.channels!.indexOf(x) > -1) {
          ignore = true;
        }
      });
    }
    if (
      res.user.length > 0 &&
      settings.ignored.users &&
      settings.ignored.users.length > 0
    ) {
      res.user.forEach((x) => {
        if (settings.ignored!.users!.indexOf(x) > -1) {
          ignore = true;
        }
      });
    }
    if (ignore) return;
  }
  const logChannel = guild.channels.cache.find(
    (x) => x.id === settings.channel
  ) as TextBasedChannel;
  if (!logChannel) return;

  return logChannel;
};

const fetchId = (arg: any[]) => {
  const res = {
    channel: new Array<string>(),
    user: new Array<string>(),
  };
  if (arg[0] instanceof User || arg[0] instanceof GuildMember) {
    res.user.push(arg[0].id);
  } else if (arg[0] instanceof Sticker) {
    res.user.push(arg[0].user?.id ?? "");
  } else if (arg[0] instanceof GuildEmoji) {
    res.user.push(arg[0].author?.id ?? "");
  } else if (arg[0] instanceof VoiceState) {
    res.user.push(arg[0].id);
    res.channel.push(arg[0].channel?.id ?? "");
    if (arg[1]) {
      res.user.push(arg[1].id);
      res.channel.push(arg[1].channel?.id ?? "");
    }
  } else if (arg[0] instanceof Message) {
    res.user.push(arg[0].author.id);
    res.channel.push(arg[0].channel.id);
  } else if (arg[0] instanceof GuildChannel) {
    res.channel.push(arg[0].id);
  }  
  return res;
};
