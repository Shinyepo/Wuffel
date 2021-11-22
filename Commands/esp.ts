import { addStreamerRanking } from "../Services/StreamerService";
import { CommandType } from "types";

export = {
  data: {
    name: "esp",
    description: "Testing ground",
  },
  async execute(client, message, type, _) {
    if (type === "sr") {
      await addStreamerRanking(client.em, message);
      return;
    }
    if (type === "guildCreate" || type === "guildDelete") {
      client.emit(type, message.guild!);
      return;
    }
    client.emit(type, message.member);
    return;
  },
} as CommandType;
