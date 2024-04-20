const Discord = require('discord.js');

module.exports = {
    name: 'support',
    description: 'Displays a link to join the support server.',
    category: 'Utility',
    run: async (client, interaction, args) => {
        const embed = new Discord.EmbedBuilder()
            .setDescription(`[\`Click to join the support 🍃〃Uhq World\`](https://discord.gg/uhq)`)
            .setColor(client.config.color);
        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
}