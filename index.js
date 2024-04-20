const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites], partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction, Partials.ThreadMember, Partials.GuildScheduledEvent] });
client.setMaxListeners(70)
const config = require('./config.json')
const db = require('quick.db');

client.setMaxListeners(0)
module.exports = client;

client.slashCommands = new Collection();
client.config = config
client.db = db

require('./Handlers')(client);
require('./Handlers/anti-crash')(client);

client.login(client.config.token);