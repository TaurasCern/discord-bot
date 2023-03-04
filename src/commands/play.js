module.exports = {
    name: 'play',
    aliases: [ 'p' ],
    inVoiceChannel: true,
    run: async (client, interaction) => {
        await client.DisTube.play(interaction.member.voice.channel, interaction.options.data[0].value, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
        });
        let songs = client.DisTube.getQueue(interaction.guildId).songs;
        let currentSong = songs[songs.length - 1];
        interaction.reply(`Added to the track list:\n${currentSong.name}`)
    }
}