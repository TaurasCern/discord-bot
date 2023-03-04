module.exports = {
    name: 'stop',
    aliases: [ 'stop' ],
    inVoiceChannel: true,
    run: async (client, interaction) => {
        const queue = client.DisTube.getQueue(interaction.guildId)
        if (!queue) return interaction.reply(`Nothing in the queue`);

        queue.stop();
        interaction.reply(`Stopped`);  
    }
}