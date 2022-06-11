import { addStreamerRanking } from "../Services/StreamerService";
import { CommandType } from "../../types";
import { setLogChannel } from "../Services/LogsService";

export = {
  data: {
    name: "esp",
    description: "Testing ground",
  },
  permissionLevel: "owner",
  async execute(client, message, type, number) {
    if (type === "messageDelete" || type === "cipskoinasso") {      
      const channel = message.mentions.channels.first();
      await setLogChannel(client.em, message.guildId!, type, channel!.id);
      return;
    }
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
