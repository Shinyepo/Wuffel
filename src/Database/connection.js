const mongoose = require('mongoose');

const url = 'mongodb+srv://WuffelJS:PizdaSzmataKleczy@wuffeldev.fodr0.mongodb.net/Wuffel?retryWrites=true&w=majority';
mongoose.connect(url);
const guildInformationSchema = new mongoose.Schema({
    guildId: {
        type: String,
        unique: true,
    },
    guildName: String,
    guildOwnerId: String,
    guildOwnerName: String,
    guildIcon: String,
    guildBanner: String,
}, { timestamps: true });

const settings = new mongoose.Schema({
    guildId: {
        type: String,
        unique: true,
    },
    active: Boolean,
    prefix: String,
    modRole: String,
    adminRole: String,
    muteRole: String,
});

const logs = new mongoose.Schema({
    guildId: {
        type: String,
        unique: true,
    },
    emoteEvents: String,
    channelEvents: String,
    messageEvents: String,
    messageEventsIgnored: String,
    roleEvents: String,

    presenceUpdate: String,
    presenceUpdateIgnored: String,
    userUpdate: String,
    guildUpdate: String,

    userMovement: String,
});

const streamerRanking = new mongoose.Schema({
    guildId: String,
    userId: String,
    timeStreamed: Number,
    lastStream: Number,
});
const startedStream = new mongoose.Schema({
    guildId: String,
    userId: String,
    startingDate: Number,
});


const GuildInformation = mongoose.model('GuildInformation', guildInformationSchema);
const Settings = mongoose.model('Setting', settings);
const Logs = mongoose.model('Log', logs);
const StreamerRanking = mongoose.model('StreamerRanking', streamerRanking);
const StartedStream = mongoose.model('StartedStream', startedStream);


module.exports = { GuildInformation, Settings, Logs, StreamerRanking, StartedStream };