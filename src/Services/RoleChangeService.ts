import { ChannelType, Guild } from "discord.js";
import { WuffelClient } from "Wuffel/types";
import { InfoEmbed } from "../Utilities/embedCreator";
import { consoleTimestamp } from "../Utilities/timestamp";
import { getLogSettings } from "./LogsService";

type ChangeArray = {
  guildId: string;
  data: userData[];
};
type userData = {
  userId: string;
  roles: RoleData[];
};
type RoleData = {
  roleId: string;
  action: boolean;
};

let data = new Array<ChangeArray>();
let active = false;

export const queueChange = async (
  client: WuffelClient,
  guild: Guild,
  userId: string,
  roleId: string,
  action: boolean
) => {
  const exisingGuild = data.find((x) => x.guildId === guild.id);

  if (exisingGuild) {
    const existingUser = exisingGuild.data.find((x) => x.userId === userId);
    if (existingUser) {
      existingUser.roles.push({ roleId, action });
    } else {
      exisingGuild.data.push({ userId, roles: [{ roleId, action }] });
    }
  } else {
    data.push({
      guildId: guild.id,
      data: [
        {
          userId,
          roles: [
            {
              roleId,
              action,
            },
          ],
        },
      ],
    });
  }
  if (!active) await changeWatcher(client);
};

const changeWatcher = async (client: WuffelClient) => {
  console.log(consoleTimestamp() + " Role change watcher initialized");
  active = true;
  await setTimeout(async () => {
    data.forEach(async (element) => {
      const guild = client.guilds.cache.find((x) => x.id === element.guildId);
      if (!guild) return;
      const settings = await getLogSettings(client.em, guild, "userEvents");

      if (!settings?.channel || !settings.on) return;

      const logChannel = guild.channels.cache.find(
        (x) => x.id === settings.channel
      );

      if (!logChannel || logChannel.type !== ChannelType.GuildText) return;
      element.data.forEach(async (data) => {
        const user = guild.members.cache.find((x) => x.id === data.userId);
        const embed = new InfoEmbed(client)
          .setTitle("User roles have been changed")
          .addFields({
            name: "Affected user",
            value: user?.toString() ?? "*???*",
            inline: true,
          });
        let formated = "";
        data.roles.forEach((roleData) => {

          const role = guild.roles.cache.find((x) => x.id === roleData.roleId);
          if (roleData.action) {
            formated += "✅ ";
          } else {
            formated += "❌ ";
          }
          formated += (role?.toString() ?? "*non existing role*") + "\n";
        });
        embed.addFields({ name: "Changes", value: formated, inline: false });

        return await logChannel.send({ embeds: [embed] });
      });
    });
    active = false;
    data = new Array<ChangeArray>();
    console.log(consoleTimestamp() + " Role change watcher finished working");
  }, 15000);
};
