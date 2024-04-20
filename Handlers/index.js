const { Client } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const eventFiles = await globPromise(`${process.cwd()}/Events/*.js`);
    eventFiles.map((value) => require(value));

    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);
        arrayOfSlashCommands.push(file);
    });
    client.on('ready', async () => {
        await client.application.commands.set(arrayOfSlashCommands);
    });
};