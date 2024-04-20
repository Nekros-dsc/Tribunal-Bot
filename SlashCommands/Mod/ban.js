const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Allows to request a ban.',
    category: 'Mod',
    options: [
        {
            name: 'user',
            description: 'Please provide a report user.',
            type: 6,
            required: true
        },
        {
            name: 'raison',
            description: 'Please provide a reason for ban.',
            type: 3,
            required: true
        },
        {
            name: 'preuve',
            description: 'Please fill in proof number 1.',
            type: 11,
            required: true
        },
        {
            name: 'preuve2',
            description: 'Please fill in proof number 2.',
            type: 11,
            required: false
        }
    ],

    run: async (client, interaction) => {
        if (client.db.get(`juge_${interaction.guild.id}_${interaction.user.id}`) || client.db.get(`police_${interaction.guild.id}_${interaction.user.id}`) === true) {
            const user = interaction.options.getUser('user').id
            const member = interaction.guild.members.cache.get(user);
            const raison = interaction.options.getString('raison');
            const proof = interaction.options.getAttachment('preuve');
            const proof2 = interaction.options.getAttachment('preuve2');

            if (member.id === interaction.user.id) {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*Impossible to banish yourself.*`)
                .setColor(client.config.color);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (member.id === interaction.guild.ownerId) {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*Cannot ban server owner.*`)
                .setColor(client.config.color);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (member.id === client.user.id){
                const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*Impossible to ban ${client.user} (\`${client.user.tag}\` | \`${client.user.id}\`).*`)
                .setColor(client.config.color);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
            if (!member.bannable) {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*Impossible to ban ${member} (\`${member.user.tag}\` | \`${member.id}\`) please check that I have a role above the member.*`)
                .setColor(client.config.color);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            let juge = `<@&${client.db.fetch(`role_juge_${interaction.guild.id}`)}>`
            if (juge == `<@&null>`) juge = '`No role defined.`'

            const channeldb = client.db.fetch(`ban_channel_${interaction.guild.id}`)
            const channel = client.channels.cache.get(channeldb)

            if (channeldb == null) {
                const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*No ban request channel has been configured on this server.*`)
                .setColor(client.config.color);
                return interaction.reply({ embeds: [embed], ephemeral: true })
            }

            const embed = new Discord.EmbedBuilder()
                .setTitle(`\`🪄\` ▸ New ban request`)
                .setDescription(`*${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) calls for the banishment of ${member} (\`${member.user.tag}\` | \`${member.id}\`) the <t:${Math.floor(interaction.createdAt / 1000)}:F> (<t:${Math.floor(interaction.createdAt / 1000)}:R>)*`)
                .addFields(
                    { name: `User :`, value: `${member.user} (\`${member.user.tag}\` | \`${member.id}\`)`, inline: false },
                    { name: `Policeman :`, value: `${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`)`, inline: false },
                    { name: `Reason :`, value: `\`\`\`${raison}\`\`\`\n**Proof :**`, inline: false })
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setColor(client.config.color)
                .setTimestamp()
                .setImage(proof.url);

            const button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`accept`)
                        .setLabel(`✅ ▸ Accept`)
                        .setStyle(3),
                    new Discord.ButtonBuilder()
                        .setCustomId(`refuse`)
                        .setLabel('❌ ▸ Refuser')
                        .setStyle(4),
                    new Discord.ButtonBuilder()
                        .setCustomId(`archive`)
                        .setLabel('📦 ▸ Archiver')
                        .setStyle(1)
                )

            const logchannel = client.db.fetch(`ban_channel_${interaction.guild.id}`)
            const log = client.channels.cache.get(logchannel)

            const message = await log.send({ embeds: [embed], content: `||${juge}||`, components: [button] })

            await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`🪄\`〃*Your request for banishment of ${member} (\`${member.user.tag}\` | \`${member.id}\`) has just been sent.*`).setColor(client.config.color)], ephemeral: true })

            const thread = await message.startThread({
                name: `Ban request for ${member.user.username} (${member.id})`,
                reason: 'Banning a member'
            })
            if (proof2) { await thread.send({ embeds: [new Discord.EmbedBuilder().setTitle(`\`🪄\`〃*Preuve N°2*`).setColor(client.config.color).setImage(proof2.url)] }) }
            await thread.send({ embeds: [new Discord.EmbedBuilder().setDescription(`\`🪄\`〃*To discuss the request, please discuss in this thread.*`).setColor(client.config.color)] })

            const collector = channel.createMessageComponentCollector()

            collector.on('collect', async i => {
                if (i.customId === `accept`) {
                    if (client.db.get(`juge_${interaction.guild.id}_${interaction.user.id}`) === true) {
                        if (interaction.member.roles.highest.comparePositionTo(i.guild.members.cache.get(member.id).roles.highest) <= 0) return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Impossible to ban ${member} (\`${member.user.tag}\` | \`${member.id}\`) please check that I have a role above the member.*`).setColor(client.config.color)], ephemeral: true })
                        if (member.id === interaction.guild.ownerId) return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Cannot ban the owner of the server that is ${member} (\`${member.user.tag}\` | \`${member.id}\`).*`).setColor(client.config.color)], ephemeral: true })
                        if (member.id === client.user.id) return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Impossible to ban ${client.user} (\`${client.user.tag}\` | \`${client.user.id}\`).*`).setColor(client.config.color)], ephemeral: true })
                        member.ban({ reason: `Banned by ${interaction.user.username} for the reason : ${raison || 'no reason'}` }).catch(e => { i.channel.send({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Error when banning ${member} (\`${member.user.tag}\` | \`${member.id}\`).*`).setColor(client.config.color)], ephemeral: true }) })

                        const acceptban = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                            .setCustomId('accepted')
                            .setLabel('✅ ▸ Accepted !')
                            .setStyle(3)
                            .setDisabled(true)
                            )

                        const embed = new Discord.EmbedBuilder()
                            .setTitle('\`✅\` ▸ Banishment request accepted')
                            .setDescription(`*${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) accepted the banishment of ${member} (\`${member.user.tag}\` | \`${member.id}\`) the <t:${Math.floor(interaction.createdAt / 1000)}:F> (<t:${Math.floor(interaction.createdAt / 1000)}:R>)*`)
                            .addFields(
                                { name: `User :`, value: `${member.user} (\`${member.user.tag}\` | \`${member.id}\`)`, inline: true },
                                { name: `Policeman :`, value: `${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`)`, inline: false },
                                { name: `Accepted by :`, value: `${i.user} (\`${i.user.tag}\` | \`${i.user.id}\`)`, inline: true },
                                { name: `Reason :`, value: `\`\`\`${raison}\`\`\`\n**Proof :**`, inline: false })
                            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                            .setColor('Green')
                            .setTimestamp()
                            .setImage(proof.url);
                        i.update({ embeds: [embed], components: [acceptban] })
                        await thread.send({ embeds: [new Discord.EmbedBuilder().setDescription(`\`✅\`〃*The ban request was accepted, ${member.user} (\`${member.user.tag}\` | \`${member.id}\`) was banned, so I close this thread.*`).setColor('Green')]})
                        await thread.setLocked(true)
                    } else {
                        return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Only a judge can interact with these buttons to make the decision.*`).setColor(client.config.color)], ephemeral: true })
                    }
                }
                if (i.customId === `refuse`) {
                    if (client.db.get(`juge_${interaction.guild.id}_${interaction.user.id}`) === true) {
                        const refuseban = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                            .setCustomId('refused')
                            .setLabel('❌ ▸ Refused !')
                            .setStyle(4)
                            .setDisabled(true)
                            )

                        const embed = new Discord.EmbedBuilder()
                            .setTitle('\`❌\` ▸ Banishment request refused')
                            .setDescription(`*${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) refused the banishment of ${member} (\`${member.user.tag}\` | \`${member.id}\`) the <t:${Math.floor(interaction.createdAt / 1000)}:F> (<t:${Math.floor(interaction.createdAt / 1000)}:R>)*`)
                            .addFields(
                                { name: `User :`, value: `${member.user} (\`${member.user.tag}\` | \`${member.id}\`)`, inline: true },
                                { name: `Policeman :`, value: `${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`)`, inline: false },
                                { name: `Refused by :`, value: `${i.user} (\`${i.user.tag}\` | \`${i.user.id}\`)`, inline: true },
                                { name: `Reason :`, value: `\`\`\`${raison}\`\`\`\n**Proof :**`, inline: false })
                            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                            .setColor('Red')
                            .setTimestamp()
                            .setImage(proof.url);
                        i.update({ embeds: [embed], components: [refuseban] })
                        await thread.send({ embeds: [new Discord.EmbedBuilder().setDescription(`\`✅\`〃*The ban request was denied, ${member.user} (\`${member.user.tag}\` | \`${member.id}\`) was not banned, so I close this thread.*`).setColor('Red')]})
                        await thread.setLocked(true)
                    } else {
                        return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Only a judge can interact with these buttons to make the decision.*`).setColor(client.config.color)], ephemeral: true })
                    }
                }
                if (i.customId === `archive`) {
                    if (client.db.get(`juge_${interaction.guild.id}_${interaction.user.id}`) === true) {
                        const archivedban = new Discord.ActionRowBuilder()
                            .addComponents(
                                new Discord.ButtonBuilder()
                            .setCustomId('archived')
                            .setLabel('📦 ▸ Archived')
                            .setStyle(1)
                            .setDisabled(true)
                            )

                        const embed = new Discord.EmbedBuilder()
                            .setTitle('\`📦\` ▸ Banishment request archived')
                            .setDescription(`*${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) a archivé le bannissement de ${member} (\`${member.user.tag}\` | \`${member.id}\`) le <t:${Math.floor(interaction.createdAt / 1000)}:F> (<t:${Math.floor(interaction.createdAt / 1000)}:R>)*`)
                            .addFields(
                                { name: `User :`, value: `${member.user} (\`${member.user.tag}\` | \`${member.id}\`)`, inline: false },
                                { name: `Policeman :`, value: `${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`)`, inline: false },
                                { name: `Archived by :`, value: `${i.user} (\`${i.user.tag}\` | \`${i.user.id}\`)`, inline: false },
                                { name: `Reason :`, value: `\`\`\`${raison}\`\`\`\n**Proof :**`, inline: false })
                            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                            .setColor('Blue')
                            .setTimestamp()
                            .setImage(proof.url);
                        i.update({ embeds: [embed], components: [archivedban] })
                        await thread.send({ embeds: [new Discord.EmbedBuilder().setDescription(`\`✅\`〃*The request for ban of ${member.user} (\`${member.user.tag}\` | \`${member.id}\`) has been archived, you can still continue to discuss in this thread.*`).setColor('Blue')]})
                        await thread.setLocked(true)
                    } else {
                        return i.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Only a judge can interact with these buttons to make the decision.*`).setColor(client.config.color)], ephemeral: true })
                    }
                }
            })
        } else {
            return await interaction.reply({ embeds: [new Discord.EmbedBuilder().setDescription(`\`❌\`〃*Only the police of the server can use this command.*`).setColor(client.config.color)], ephemeral: true })
        }
    }
}