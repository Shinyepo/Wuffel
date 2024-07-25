import { ShardingManager } from "discord.js";
import { consoleTimestamp } from "./src/Utilities/timestamp";
import { config } from 'dotenv-safe';

const main = async () => {
  config();
  const manager = new ShardingManager(__dirname + "/bot.js", {
    token: process.env.TOKEN,
    respawn: true,
    totalShards: 1,
  });  

  manager.on("shardCreate", (shard) =>
    console.log(
      consoleTimestamp() +
        ` Launching shard ${shard.id} of ${(manager.totalShards as number) - 1}`
    )
  );

  await manager.spawn();
  console.log("\n" + consoleTimestamp() + " Finished launching all shards.")

};

main();
