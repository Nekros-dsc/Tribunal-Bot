const Discord = require('discord.js');
const client = require('../index');

client.on('ready', () => {
    console.log(`[!] — Logged in as ${client.user.tag} (${client.user.id})`);

    const statut = [
        () => `The judgments`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Members`,
        () => `${client.guilds.cache.size} Servers`,
        () => `By nekrxs.`,
        () => `discord.gg/uhq`
    ]

    let i = 0

    setInterval(() => {
        client.user.setPresence({
            activities: [
              {
                name: statut[i](),
                type: Discord.ActivityType.Competing,
                url: 'https://www.twitch.tv/nekros_dsc',
              },
            ],
            status: 'dnd',
          });
        i = ++i % statut.length
    }, 10000)
})