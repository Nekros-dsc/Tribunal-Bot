const Discord = require('discord.js');
const client = require('../index');

client.on('interactionCreate', async (interaction) => {
    
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        
        if (!cmd) {
        const embed = new Discord.EmbedBuilder()
        .setDescription(`\`🪄\`〃*An error has occured.*`)
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
        .setColor(client.config.color)
        return interaction.reply({ embeds: [embed], ephemeral : true});
        }
           
        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === 1) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }
});