const { Sequelize, DataTypes } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
	return sequelize.define('GuildInformation', {
		id: {
			type: DataTypes.INTEGER,
			unique: true,
			primaryKey: true,
			autoIncrement: true,
		},
		guildId: {
			type: DataTypes.BIGINT,
			unique: true,
		},
		guildName: DataTypes.STRING,
		guildAvatar: DataTypes.STRING,
		guildOwnerId: DataTypes.BIGINT,
		guildOwnerName: DataTypes.STRING,
	});
 };