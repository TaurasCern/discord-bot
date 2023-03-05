require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const Discord = require('discord.js');
const { DisTube } = require(`distube`);
const { captureRejectionSymbol } = require('events');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ]
});

client.DisTube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    leaveOnFinish: true,
});

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

fs.readdir(path.join(__dirname + `/commands/`), (err, files) => {
    if(err) return console.log(`No commands found. ${err}`);

    let commandFiles = files.filter(f => f.split('.').pop() === 'js');

    if(commandFiles.length <= 0) return console.log('No commands found');

    commandFiles.forEach(file => {
        let command = require(`./commands/${file}`)

        client.commands.set(command.name, command)
        if(command.aliases) command.aliases.forEach(alias => client.aliases.set(alias, command.name))
    });
});


client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()
    || interaction.user.bot
    || !interaction.guild) return;

    let command = client.commands.get(interaction.commandName)
    || client.commands.get(client.aliases.get((interaction.commandName)))

    if(command.inVoiceChannel && !interaction.member.voice.channel){
        return interaction.reply('You have to be in a voice channel');
    }

    try {
        command.run(client, interaction);
    }
    catch {
        console.log(e);
        interaction.reply(`Error: ${e}`);
    }
});

client.DisTube
    .on(`playSong`, (queue, song) => queue.textChannel.send(
        `Now playing:\n${song.name}\n<${song.url}>`))
    .on(`addSong`, (queue, song) => queue.textChannel.send(
        `Added to the queue:\n${song.name}\n<${song.url}>`));

client.login(process.env.TOKEN);