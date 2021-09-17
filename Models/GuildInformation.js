const { DataTypes, Model } = require('sequelize');
const { connection } = require('../Configuration/Sequelize');

class GuildInformation extends Model {}
GuildInformation.init({
    id: {
		type: DataTypes.INTEGER,
		unique: true,
        primaryKey: true,
	},
	guildId: {
		type: DataTypes.BIGINT,
		unique: true,
	},
	guildName: DataTypes.STRING,
    guildAvatar: DataTypes.STRING,
	guildOwnerId: DataTypes.BIGINT,
	guildOwnerName: DataTypes.STRING,

}, {
    modelName: 'GuildInformation',
    sequelize: connection,
});
