import { addStreamerRanking } from "../Services/StreamerService";
import { CommandType } from "types";

export = {
  data: {
    name: "esp",
    description: "Testing ground",
  },
  async execute(client, message, type, number) {
    if (type === "sr") {
      await addStreamerRanking(client.em, message);
      return;
    }
    if (type === "guildCreate" || type === "guildDelete") {
      client.emit(type, message.guild!);
      return;
    }
    const parsedInt = parseInt(number);
    if ((type === "guildMemberAdd" || type === "guildMemberRemove") && parsedInt > 0) {
      for (let i = 0; i < parsedInt; i++) {
        client.emit(type, message.member!);
      }
      message.channel.send(`Added user traffic data ${parsedInt} time(s).`);
      return;
    }

    client.emit(type, message.member);
    return;
  },
} as CommandType;
