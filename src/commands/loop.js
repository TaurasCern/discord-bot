module.exports = {
    name: 'loop',
    aliases: [ 'loop' ],
    inVoiceChannel: true,
    run: async (client, interaction) => {
        const queue = client.DisTube.getQueue(interaction.guildId)
        if (!queue) return message.channel.send(`There is nothing playing`)

        let mode = queue.repeatMode;

        if(mode === 0){
            queue.setRepeatMode(2);
            interaction.reply(`Queue looped`);
        }
        else {
            queue.setRepeatMode(0);
            interaction.reply(`Loop stopped`);
        }
    }
}