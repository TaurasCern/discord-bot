require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { DisTube } = require(`distube`)

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

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isChatInputCommand()
    || interaction.user.bot
    || !interaction.guild) return;
    if(interaction.commandName === `play`){
        client.DisTube.play(interaction.member.voice.channel, interaction.options.data[0].value, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        })
        interaction.deferReply();
        interaction.deleteReply();
    }
    else if(interaction.commandName === `skip`){
        const queue = client.DisTube.getQueue(interaction.guildId);
        if(!queue){
            return interaction.reply(`There is nothing in the queue`);
        }
        try {
            const song = await queue.skip();
            client.DisTube.skip(`Skipped ${song.name}`);
        }
        catch {
            interaction.reply(`No more songs in the queue`);
        }
        
    }
    else if(interaction.commandName === `stop`){
        client.DisTube.stop(interaction.guildId);
        interaction.reply(`Stopped`);  
    }

    
});

client.DisTube
    .on(`playSong`, (queue, song) => queue.textChannel.send(
        `Now playing - ${song.name}: <${song.url}>`))
    .on(`addSong`, (queue, song) => queue.textChannel.send(
        `Added to the queue - ${song.name}: <${song.url}>`));

client.login(process.env.TOKEN);