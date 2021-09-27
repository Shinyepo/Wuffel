const { ShardingManager } = require('discord.js');
const { token } = require('./config.json');
const { consoleTimestamp } = require('./Utilities/timestamp');

const manager = new ShardingManager('./bot.js', {
	token: token,
	respawn: true,
	totalShards: 2,
 });

manager.on('shardCreate', shard => console.log(consoleTimestamp() + ` Launching shard ${shard.id} of ${manager.totalShards - 1}`));

manager.spawn().then((shards) => {
	console.log('\n' + consoleTimestamp() + ' Finished launching all shards.');
});

