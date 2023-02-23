require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
    {
        name: 'play',
        type: 1,
        description: "Plays a song from the given query",
        options: [
        {
            name: `query`,
            description: `Name or link of the video`,
            type: 3,
            required: true
        }]
    },
    {
        name: 'skip',
        type: 1,
        description: "Skips to the next song",
    },
    {
        name: 'stop',
        type: 1,
        description: "Stops the music bot",
    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try{
        await rest.put(
            Routes.applicationCommands(
                process.env.CLIENT_ID),
                { body: commands }
        );

        console.log(`success`);
    }
    catch(err) {
        console.log(`${err}}`);
    }
})();