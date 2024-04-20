const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: 'police',
    description: 'Allows to manage the server\'s police officers.',
    category: 'Admin',
    options: [
        {
            name: 'add',
            description: 'Allows to add a police officer to the server.',
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
            description: 'Allows to remove a police officer from the server.',
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
            description: 'Allows to display all police officers on the server.',
            type: 1,
        },
        {
            name: 'clear',
            description: 'Allows to delete all police officers from the server.',
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
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const police = db.get(`police_${interaction.guild.id}_${member.id}`);

                if (user.bot) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*You cannot add a bot to the police list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
                
                if (police == true) {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is already on the police list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                } else { 
                    db.set(`police_${interaction.guild.id}_${member.id}`, true);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now in the police list.*`);
                    interaction.reply({ embeds: [embed] });
                }
            }
            else if (SubCmd == 'remove') {
                const user = interaction.options.getUser('user');
                const member = interaction.guild.members.cache.get(user.id);
                const police = db.get(`police_${interaction.guild.id}_${member.id}`);
            
                if (police === true) {
                    db.delete(`police_${interaction.guild.id}_${member.id}`);
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`✅\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is now no longer on the police list.*`);
                    return interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new Discord.EmbedBuilder().setColor(client.config.color).setDescription(`\`❌\`〃*${member.user} (\`${member.user.tag}\` | \`${member.user.id}\`) is not in the police list.*`);
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }   
            else if (SubCmd == 'list') {
                const data = db.all().filter(data => data.ID.startsWith(`police_${interaction.guild.id}`)).sort((a, b) => b.data - a.data)

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`\`🪄\` ▸ List of Police Officers`)
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setColor(client.config.color)
                    .setTimestamp()
                    .setDescription(data.map((m, c) => `\`${c + 1} —\` <@${m.ID.split('_')[2]}> (\`${client.users.cache.get(m.ID.split('_')[2]).username}\` | \`${m.ID.split('_')[2]}\``).join('\n') || '\`Nobody\`')
                interaction.reply({ embeds: [embed], ephemeral: true })


            } else if (SubCmd == 'clear') {
                const clear = db.all().filter(data => data.ID.startsWith(`police_${interaction.guild.id}`));
            
                let embed;
                let ephemeral = true;

                if (clear.length === 0) {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription('\`❌\`〃*No users found in police list.*');
                } else {
                    embed = new Discord.EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(`\`✅\`〃\`${clear.length}\` ${clear.length > 1 ? '*people were successfully deleted*' : '*person was successfully deleted*'} *dfrom the list of police officers.*`);
            
                        ephemeral = false;

                    for (let i = 0; i < clear.length; i++) {
                        db.delete(clear[i].ID);
                    }
                }
                interaction.reply({ embeds: [embed], ephemeral: ephemeral });
            }            
    }
}