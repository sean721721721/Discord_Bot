import { Client, IntentsBitField } from 'discord.js';
import { searchRating } from './api/searchRating';

require('dotenv').config({ path: __dirname + '/.env' });
const cCommandMap: Record<string, string> = {
	'!commands': '查詢指令列表',
	'!me': '查詢自己的積分',
};
const cProfileIdMap: Record<string, string> = {
	martren: '5742933',
	sean: '5742909',
	shuo: '4247161',
};
const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});
client.on('messageCreate', async (message) => {
	if (message.content === '!commands') {
		const replyMessage = Object.keys(cCommandMap).reduce((acc, key) => `${acc}\n${key}: ${cCommandMap[key]}`, '');
		await message.reply(replyMessage);
	}
	if (message.content === '!me') {
		const replyMessage = await searchRating(cProfileIdMap, message.author.username);
		await message.reply(replyMessage);
	}
});
client.on('ready', async () => {
	console.log('Bot is ready!');
	// const channelArabia = client.channels.cache.get(process.env.CHANNEL_ARABIA_ID);
	// channelArabia.send(
	// 	`@everyone 你好，現在可以對我下達以下指令:flushed: \n\`\`\`${Object.keys(cCommandMap).reduce(
	// 		(acc, key) => `${acc}\n${key}: ${cCommandMap[key]}`,
	// 		''
	// 	)}\`\`\``
	// );
});
client.login(process.env.DISCORD_TOKEN);
