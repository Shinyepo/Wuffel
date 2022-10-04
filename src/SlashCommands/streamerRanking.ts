import { StreamLeaderboard } from "../Entities/StreamLeaderboard";
import { SlashCommandType } from "../../types";
import format from "format-duration";
import { LeaderboardEmbed } from "../Utilities/embedCreator";
import { SlashCommandBuilder } from "discord.js";

const emotes = [
  "🥇",
  "🥈",
  "🥉",
  "<:medal4:831979903049007114>",
  "<:medal5:831979917230735381>",
];

export = {
  data: new SlashCommandBuilder()
    .setName("streamerranking")
    .setDescription("Display top 5 streamers on this server"),
  async execute(client, interacion) {
    const context = client.em.fork();
    const leaderboard = await context.find(StreamLeaderboard, {
      guildId: interacion.guildId,
    });
    if (leaderboard.length < 1) {
      const embed = new LeaderboardEmbed(interacion);
      embed
        .setTitle("🤔")
        .setDescription(
          "There is no data yet. Start streaming now to claim 1st place!"
        );
      return await interacion.reply({ embeds: [embed] });
    }

    let data = "";
    let i = 0;
    while (i < 5 && i < leaderboard.length) {
      const userData = leaderboard[i];
      const member = interacion.guild!.members.cache.get(userData.userId);
      if (!member) continue;
      console.log(typeof userData.timeStreamed)
      const formatedTime = format(parseInt(userData.timeStreamed));
      const name = member?.nickname ?? member?.user.username;
      data += emotes[i] + " **" + name + "** " + formatedTime + "\n";
      i++;
    }

    const embed = new LeaderboardEmbed(interacion);
    embed.setTitle(`Top ${i} streamers`).setDescription("[dd:hh:mm:ss]\n"+data);
    return await interacion.reply({ embeds: [embed] });
  },
} as SlashCommandType;
