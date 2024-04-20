const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'juge',
    description: 'Allows you to manage server judges.',
    category: 'Admin',
    options: [
        {
            name: 'add',
            description: 'Allows you to add a judge to the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Please inform the user.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Allows you to remove a judge from the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Please inform the user.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'Allows you to display all the judges on the server.',
            type: 1,
        },
        {
            name: 'clear',
            description: 'Allows you to remove all judges from the server.',
            type: 1
        },
    ],

    /**
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */

    run: async (client, interaction, args) => {
        const [SubCmd] = args

        if (!client.db.get(`owner_${interaction.guild.id}_${interaction.user.id}`) && interaction.user.id !== interaction.guild.ownerId) {
            const embed = new Discord.EmbedBuilder()
                .setDescription(`\`❌\`〃*You must be the owner of the bot on the server or be the owner of the server to use this command.*`)
                .setColor(client.config.color);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
            if (SubCmd == 'add') {
                const log = client.db.fetch(`logs_${interaction.guild.id}`)
                const logs = client.channels.cache.get(log)
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const juge = db.get(`juge_${interaction.guild.id}_${member.id}`);

                if (user.bot) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*You cannot add a bot to the judges list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (juge == true) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is already on the list of judges.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                } else { 
                    db.set(`juge_${interaction.guild.id}_${member.id}`, true);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now on the judges' list.*`);
                    interaction.reply({ embeds: [embed] });
                }
                if (log) {
                    try {
                        const embed = new Discord.EmbedBuilder()
                        .setTitle(`\`🪄\` ▸ Juge Add`)
                        .setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) just added ${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) in the list of judges.*`)
                        .setColor(client.config.color);
                        return logs.send({ embeds: [embed] });
                    } catch {}
                }
                if (!log) return;
            }
            else if (SubCmd == 'remove') {
                const log = client.db.fetch(`logs_${interaction.guild.id}`)
                const logs = client.channels.cache.get(log)
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const juge = db.get(`juge_${interaction.guild.id}_${member.id}`);
            
                if (juge === true) {
                    db.delete(`juge_${interaction.guild.id}_${member.id}`);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now no longer on the list of judges.*`);
                    return interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is not in the list of judges.*`);
                     interaction.reply({ embeds: [embed], ephemeral: true });
                }
                if (log) {
                    try {
                        const embed = new Discord.EmbedBuilder()
                        .setTitle(`\`🪄\` ▸ Juge Remove`)
                        .setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) just removed ${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) from the list of judges.*`)
                        .setColor(client.config.color);
                        return logs.send({ embeds: [embed] });
                    } catch {}
                }
                if (!log) return;
            }        
            else if (SubCmd == 'list') {
                const data = db.all().filter(data => data.ID.startsWith(`juge_${interaction.guild.id}`)).sort((a, b) => b.data - a.data)

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`\`🪄\` ▸ List of Judges`)
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setDescription(data.map((m, c) => `\`${c + 1} —\` <@${m.ID.split('_')[2]}> (\`${client.users.cache.get(m.ID.split('_')[2]).username}\` | \`${m.ID.split('_')[2]}\``).join('\n') || '\`Nobody\`')
                interaction.reply({ embeds: [embed], ephemeral: true })
            } else if (SubCmd == 'clear') {
                const log = client.db.fetch(`logs_${interaction.guild.id}`)
                const logs = client.channels.cache.get(log)
                const clear = db.all().filter(data => data.ID.startsWith(`juge_${interaction.guild.id}`));
            
                let embed;
                let ephemeral = true;

                if (clear.length === 0) {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription('\`❌\`〃*No users found in judges list.*');
                } else {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(`\`✅\`〃\`${clear.length}\` ${clear.length > 1 ? '*people were successfully deleted*' : '*person was successfully deleted*'} *from the list of judges.*`);
                        
                        ephemeral = false;

                    for (let i = 0; i < clear.length; i++) {
                        db.delete(clear[i].ID);
                    }
                }
                if (log) {
                    try {
                        const embed = new Discord.EmbedBuilder()
                        .setTitle(`\`🪄\` ▸ Juge Clear`)
                        .setDescription(`> *${interaction.user} (\`${interaction.user.tag}\` | \`${interaction.user.id}\`) just cleared the list of judges (\`${clear.length}\`).*`)
                        .setColor(client.config.color);
                        logs.send({ embeds: [embed] });
                    } catch {}
                }
                if (!log) return;
                return interaction.reply({ embeds: [embed], ephemeral: ephemeral });
            }
    }
}