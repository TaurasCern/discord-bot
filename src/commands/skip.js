module.exports = {
    name: 'skip',
    aliases: [ 's' ],
    inVoiceChannel: true,
    run: async (client, interaction) => {
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
}