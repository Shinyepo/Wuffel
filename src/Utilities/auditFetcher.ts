import { Guild,  GuildAuditLogsResolvable } from "discord.js";

export const fetchAudit = async (guild: Guild, type: GuildAuditLogsResolvable, limit = 1) => {
    const audit = (await guild.fetchAuditLogs({limit, type})).entries.first();

    if (audit) {
        const { executor, target, changes, createdTimestamp } = audit;
        return {executor, target, changes, createdTimestamp};
    }
    return null;
}