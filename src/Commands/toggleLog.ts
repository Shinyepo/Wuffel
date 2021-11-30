import { CommandType } from "../../types";
import { toggleLog } from "../Services/LogsService";

export = {
  data: {
    name: "toggleLog",
    description:
      "You can turn on/off logs with this command without destroying its configuration.",
  },
  async execute(client, message, eventName, state) {
    if (!message.guildId) return null;
    let convertedState;
    switch (state?.toLowerCase()) {
      case "on":
        convertedState = true;
        break;
      case "true":
        convertedState = true;
        break;
      case "false":
        convertedState = false;
        break;
      case "off":
        convertedState = false;
        break;
      default:
        convertedState = undefined;
        break;
    }
    const result = await toggleLog(
      client.em,
      message.guildId,
      eventName,
      convertedState
    );
    if (result === true) {
      return await message.reply(`${eventName} successfully turned on.`);
    } else if (result === false) {
      return await message.reply(`${eventName} successfully turned off.`);
    } else {
      return await message.reply(
        `Something went wrong while toggling state for ${eventName}\nMissing configuration for provided event name?`
      );
    }
  },
} as CommandType;
