const Discord = require('discord.js');

module.exports = {
    name: 'config',
    description: 'Allows to manage the configuration.',
    category: 'Admin',
    options: [
        {
            name: 'channel',
            description: 'Configure the channel where the ban requests will be sent.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'Please provide the channel.',
                    type: 7,
                    required: true
                }
            ]
        },
        {
            name: 'logs',
            description: 'Configure the channel where the logs will be sent.',
            type: 1,
            options: [
                {
                    name: 'channel',
                    description: 'Please provide the channel.',
                    type: 7,
                    required: true
                }
            ]
        },
        {
            name: 'roles',
            description: 'Configure the roles of judges and police officers.',
            type: 1,
            options: [
                {
                    name: 'type',
                    description: 'Please choose between judge or police officer.',
                    type: 3,
                    choices: [
                        {
                            name: 'Judge',
                            value: 'juge'
                        },
                        {
                            name: 'Policeman',
                            value: 'police'
                        }
                    ],
                    required: true
                },
                {
                    name: 'role',
                    description: 'Please choose the role.',
                    type: 8,
                    required: true
                }
            ]
        },
        {
            name: 'infos',
            description: 'Allows to have the server configuration information.',
            type: 1
        }
    ],

    run: async (client, interaction, args) => {
        const [SubCmd] = args

        if (!client.db.get(`owner_${interaction.guild.id}_${interaction.user.id}`) && interaction.user.id !== interaction.guild.ownerId) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*You must be the owner of the bot on the server or be the owner of the server to use this command.*`)
                .setColor(client.config.color);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

            if (SubCmd == 'channel') {
                const outils = client.db.fetch(`logs_${interaction.guild.id}`)
                const salon = interaction.options.getChannel('channel')
                const logs = client.channels.cache.get(outils)

                const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*Please specify a valid text channel.*`)
                const embed2 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*The new ban request channel is now <#${salon.id}> (\`${salon.name}\` | \`${salon.id}\`).*`)
                const embed3 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) just changed the ban request channel on [\`${salon.name}\`](https://discord.com/channels/${interaction.guild.id}/${salon.id}) ([\`${salon.id}\`](https://discord.com/channels/${interaction.guild.id}/${salon.id})).*`)
                const embed4 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*The channel you have entered is already configured.*`)
                if (salon.id === client.db.fetch(`ban_channel_${interaction.guild.id}`)) return interaction.reply({ embeds: [embed4], ephemeral: true })

                if (!salon) return interaction.reply({ embeds: [embed], ephemeral: true });

                client.db.set(`ban_channel_${interaction.guild.id}`, salon.id);
                interaction.reply({ embeds: [embed2] });

                if (outils) {
                    try {
                        logs.send({ embeds: [embed3] });
                    } catch {}
                }
                if (!outils) return;
            }

            if (SubCmd == 'logs') {
                const outils = client.db.fetch(`logs_${interaction.guild.id}`)
                const salon = interaction.options.getChannel('channel')
                const logs = client.channels.cache.get(outils)

                const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*Please specify a valid text channel.*`)
                const embed2 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*The new ban request channel is now <#${salon.id}> (\`${salon.name}\` | \`${salon.id}\`).*`)
                const embed3 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) just changed the ban request channel on [\`${salon.name}\`](https://discord.com/channels/${interaction.guild.id}/${salon.id}) ([\`${salon.id}\`](https://discord.com/channels/${interaction.guild.id}/${salon.id})).*`)
                const embed4 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*The channel you have entered is already configured.*`)
                if (salon.id === client.db.fetch(`logs_${interaction.guild.id}`)) return interaction.reply({ embeds: [embed4], ephemeral: true })

                if (!salon) return interaction.reply({ embeds: [embed], ephemeral: true });

                client.db.set(`logs_${interaction.guild.id}`, salon.id);
                interaction.reply({ embeds: [embed2] });

                if (outils) {
                    try {
                        logs.send({ embeds: [embed3] });
                    } catch {}
                }
                if (!outils) return;
            }

            if (SubCmd == 'roles') {
                const option = interaction.options.getString('type')

                if (option === 'juge') {
                    const outils = client.db.fetch(`logs_${interaction.guild.id}`)
                    const logs = client.channels.cache.get(outils)
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*Please provide me with a valid role.*`)

                    const role = interaction.options.getRole('role')
                    if (!role) interaction.reply({ embeds: [embed], ephemeral: true })

                    client.db.set(`role_juge_${interaction.guild.id}`, role.id)

                    const embed2 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*The new role assigned to judges is now <@&${role.id}> (\`${role.name}\` | \`${role.id}\`).*`)
                    interaction.reply({ embeds: [embed2] })

                    const embed3 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) have just changed the role of judges to ${role} (\`${role.name}\` | \`${role.id}\`).*`)
                    if (outils) {
                        try {
                            logs.send({ embeds: [embed3] });
                        } catch {}
                    }
                    if (!outils) return;
                }
                if (option === 'police') {
                    const outils = client.db.fetch(`logs_${interaction.guild.id}`)
                    const logs = client.channels.cache.get(outils)
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*Please provide me with a valid role.*`)

                    const role = interaction.options.getRole('role')
                    if (!role) interaction.reply({ embeds: [embed], ephemeral: true })

                    client.db.set(`role_police_${interaction.guild.id}`, role.id)

                    const embed2 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*The new role assigned to police officers is now <@&${role.id}> (\`${role.name}\` | \`${role.id}\`).*`)
                    interaction.reply({ embeds: [embed2] })

                    const embed3 = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) have just changed the role of judges to ${role} (\`${role.name}\` | \`${role.id}\`).*`)
                    if (outils) {
                        try {
                            logs.send({ embeds: [embed3] });
                        } catch {}
                    }
                    if (!outils) return;
                }
            }

            if (SubCmd == 'infos') {
                let ban = `<#${client.db.fetch(`ban_channel_${interaction.guild.id}`)}>`
                let banid = `${client.db.fetch(`ban_channel_${interaction.guild.id}`)}`
                if (ban == '<#null>') ban = '`None`'
                if (banid == 'null') banid = '`None`'

                let juge = `<@&${client.db.fetch(`role_juge_${interaction.guild.id}`)}>`
                let jugeid = `${client.db.fetch(`role_juge_${interaction.guild.id}`)}`
                if (juge == '<@&null>') juge = '`None`'
                if (jugeid == 'null') jugeid = '`None`'

                let police = `<@&${client.db.fetch(`role_police_${interaction.guild.id}`)}>`
                let policeid = `${client.db.fetch(`role_police_${interaction.guild.id}`)}`
                if (police == '<@&null>') police = '`None`'
                if (policeid == 'null') policeid = '`None`'

                let logs = `<#${client.db.fetch(`logs_${interaction.guild.id}`)}>`
                let logsid = `${client.db.fetch(`logs_${interaction.guild.id}`)}`
                if (logs == '<#null>') logs = '`None`'
                if (logsid == 'null') logsid = '`None`'

                const embed = new Discord.EmbedBuilder()
                .setTitle('\`🪄\` ▸ Configuration Informations')
                .setDescription(`\`👮‍♂️\` ▸ *Police Role :* ${police} (\`${policeid}\`)\n\`👨‍⚖️\` ▸ *Judge Role :* ${juge} (\`${jugeid}\`)\n\`🔨\` ▸ *Ban Channel :* ${ban} (\`${banid}\`)\n\`📂\` ▸ *Logs :* ${logs} (\`${logsid}\`)`)
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setColor(client.config.color)
                .setTimestamp()
                interaction.reply({ embeds: [embed], ephemeral: true })
            }
        }
    }