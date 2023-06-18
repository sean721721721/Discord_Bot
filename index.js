import dotenv from 'dotenv';
dotenv.config();

import { Client, IntentsBitField } from 'discord.js';

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});

client.on('messageCreate', async (message) => {
	console.log(message.content);
	if (message.content === '!ping') {
		await message.reply('pong!');
	}
});
client.on('ready', async () => {
	console.log('Bot is ready!');
});
client.login(process.env.DISCORD_TOKEN);
