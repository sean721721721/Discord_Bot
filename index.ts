import { Client, IntentsBitField } from 'discord.js';
import { getMatchList } from './api/getMatchList';
import { searchRating } from './api/searchRating';

require('dotenv').config({ path: __dirname + '/.env' });
const cCommandMap: Record<string, string> = {
	'!commands': '查詢指令列表',
	'!me': '查詢自己的積分',
	'!recent:s': '查詢最近 10 場單人對戰結果',
	'!recent:t': '查詢最近 10 場團隊對戰結果',
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
		const messageRef = await message.reply('斥侯正在蒐集情報...');
		const replyMessage = await searchRating(cProfileIdMap, message.author.username);
		await messageRef.edit(replyMessage);
	}
	if (new RegExp(`^!recent:[st]`).test(message.content)) {
		const isSolo = message.content === '!recent:s';
		const messageRef = await message.reply('斥侯正在蒐集情報...');
		const replyMessage = await getMatchList(cProfileIdMap, message.author.username, isSolo);
		await messageRef.edit(replyMessage);
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
