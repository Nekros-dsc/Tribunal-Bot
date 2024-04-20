const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays the help menu.',
    category: 'Utility',
    run: async (client, interaction, args) => {

        const menu = new Discord.ActionRowBuilder()
            .addComponents(new Discord.StringSelectMenuBuilder()
                    .setCustomId('help_menu')
                    .setPlaceholder('Select a category.')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: ' ▸ Home',
                            emoji: '🏠',
                            value: 'help_home'
                        },
                        {
                            label: ' ▸ Owner',
                            emoji: '👑',
                            value: 'help_owner'
                        },
                        {
                            label: ' ▸ Police',
                            emoji: '👮‍♂️',
                            value: 'help_police'
                        },
                        {
                            label: ' ▸ Juge',
                            emoji: '👨‍⚖️',
                            value: 'help_juge'
                        },
                        {
                            label: ' ▸ Configuration',
                            emoji: '🚀',
                            value: 'help_config'
                        }
                    ])
            )

        const embed = new Discord.EmbedBuilder()
            .setTitle(`\`🏠\` ▸ ${client.user.username}'s Help Menu`)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setColor(client.config.color)
            .setTimestamp()
            .setDescription('*Use the select menu to navigate the commands you can use.*')
        await interaction.reply({ embeds: [embed], components: [menu], ephemeral: true })

        const collector = interaction.channel.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.values[0] === 'help_home') {
                return i.update({ embeds: [embed], components: [menu] })
            }

            if (i.values[0] === 'help_owner') {
                const embed = new Discord.EmbedBuilder()
                    .setTitle('\`👑\` ▸ Owner Commands')
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .addFields(
                        { name: '/owner add', value: '*\`— Add an owner to the server\`*' },
                        { name: '/owner remove', value: '*\`— Remove an owner from the server\`*' },
                        { name: '/owner list', value: '*\`— Displays the list of server owners\`*' },
                        { name: '/owner clear', value: '*\`— Remove all owners from the server\`*' })
                return i.update({ embeds: [embed], components: [menu], ephemeral: true })
            }

            if (i.values[0] === 'help_police') {
                const embed = new Discord.EmbedBuilder()
                    .setTitle('\`👮‍♂️\` ▸ Police Commands')
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .addFields(
                        { name: '/police add', value: '*\`— Add a policeman to the server\`*' },
                        { name: '/police remove', value: '*\`— Remove a policeman from the server\`*' },
                        { name: '/police list', value: '*\`— Displays the list of police officers on the server\`*' },
                        { name: '/police clear', value: '*\`— Remove all police officers from the server\`*' })
                return i.update({ embeds: [embed], components: [menu], ephemeral: true })
            }

            if (i.values[0] === 'help_juge') {
                const embed = new Discord.EmbedBuilder()
                    .setTitle('\`👨‍⚖️\` ▸ Judge\`s Commands')
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .addFields(
                        { name: '/juge add', value: '*\`— Add a judge to the server\`*' },
                        { name: '/juge remove', value: '*\`— Remove a judge from the server\`*' },
                        { name: '/juge list', value: '*\`— Displays the list of judges on the server\`*' },
                        { name: '/juge clear', value: '*\`— Remove all judges from the server\`*' })
                return i.update({ embeds: [embed], components: [menu], ephemeral: true })
            }

            if (i.values[0] === 'help_config') {
                const embed = new Discord.EmbedBuilder()
                    .setTitle('\`🚀\` ▸ Configuration Commands')
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .addFields(
                        { name: '/config channel', value: '*\`— Allows to configure the channel where the requests will be sent\`*' },
                        { name: '/config roles', value: '*\`— Allows to configure job roles\`*' },
                        { name: '/config infos', value: '*\`— Allows to see configuration information\`*' })
                return i.update({ embeds: [embed], components: [menu], ephemeral: true })
            }
        })
    }
}