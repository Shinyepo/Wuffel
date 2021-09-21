const { Sequelize, DataTypes } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 */
module.exports = (sequelize) => {
	return sequelize.define('Settings', {
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
		active: DataTypes.BOOLEAN,
        prefix: DataTypes.STRING,
        modRole: DataTypes.BIGINT,
        adminRole: DataTypes.BIGINT,
        disabledCommands: DataTypes.TEXT,
        systemNotice: DataTypes.BOOLEAN,
        clearBotMessages: DataTypes.BOOLEAN,
        clearUserMessages: DataTypes.BOOLEAN,
        muteRole: DataTypes.BIGINT,
	});
 };