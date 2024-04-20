const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'owner',
    description: 'Allows to manage server owners.',
    category: 'Admin',
    options: [
        {
            name: 'add',
            description: 'Allows to add an owner to the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Please provide the user.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Allows to remove an owner from the server.',
            type: 1,
            options: [
                {
                    name: 'user',
                    description: 'Please provide the user.',
                    type: 6,
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'Allows to display all the owners of the server.',
            type: 1,
        },
        {
            name: 'clear',
            description: 'Allows to delete all owners from the server.',
            type: 1
        },
    ],

    /**
    * @param {Client} client 
    * @param {CommandInteraction} interaction 
    */

    run: async (client, interaction, args) => {
        const [SubCmd] = args
        
        if (interaction.user.id !== interaction.guild.ownerId && !client.config.owners.includes(interaction.user.id)) {
            const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*You must be the server owner or one of the bot owners to perform this command.*`);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

            if (SubCmd == 'add') {
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const owner = db.get(`owner_${interaction.guild.id}_${member.id}`);

                if (user.bot) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*You cannot add a bot to the owners list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                if (owner == true) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is already in the owners list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                } else { 
                    db.set(`owner_${interaction.guild.id}_${member.id}`, true);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now in the owners list.*`);
                    interaction.reply({ embeds: [embed] });
                }
            }
            else if (SubCmd == 'remove') {
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const owner = db.get(`owner_${interaction.guild.id}_${member.id}`);

                if (owner === true) {
                    db.delete(`owner_${interaction.guild.id}_${member.id}`);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now no longer in the list of owners.*`);
                    return interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is not in the list of owners.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }   
            else if (SubCmd == 'list') {
                const data = db.all().filter(data => data.ID.startsWith(`owner_${interaction.guild.id}`)).sort((a, b) => b.data - a.data)

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`\`🪄\` ▸ List of Owners`)
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setDescription(data.map((m, c) => `\`${c + 1} —\` <@${m.ID.split('_')[2]}> (\`${client.users.cache.get(m.ID.split('_')[2]).username}\` | \`${m.ID.split('_')[2]}\``).join('\n') || '\`Nobody\`')
                interaction.reply({ embeds: [embed], ephemeral: true })


            } else if (SubCmd == 'clear') {
                const clear = db.all().filter(data => data.ID.startsWith(`owner_${interaction.guild.id}`));
            
                let embed;
                let ephemeral = true;

                if (clear.length === 0) {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription('\`❌\`〃*No users found in the owners list.*');
                } else {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(`\`✅\`〃\`${clear.length}\` ${clear.length > 1 ? '*people were successfully deleted*' : '*person was successfully deleted*'} *from the list of owners.*`);
            
                        ephemeral = false;

                    for (let i = 0; i < clear.length; i++) {
                        db.delete(clear[i].ID);
                    }
                }
                interaction.reply({ embeds: [embed], ephemeral: ephemeral });
            } 
    }
}