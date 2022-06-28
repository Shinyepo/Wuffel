import { TextChannel } from "discord.js";
import { WuffelClient } from "Wuffel/types";

export const handled = async (client: WuffelClient, err: string) => {
  const channel = client.guilds.cache
    .find((x) => x.id === "812328100988977162")
    ?.channels.cache.find((x) => x.id === "821288092853862461") as TextChannel;
  if (!channel) return;
  return await channel.send(err);
};
