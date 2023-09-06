import { Client, IntentsBitField } from 'discord.js';
import { getMatchList } from './api/getMatchList';
import { getRealTimeMatches } from './api/getRealTimeMatch';
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
	LittleMing: '16197964',
};
const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent],
});
client.on('messageCreate', async (message) => {
	if (message.content === '!commands') {
		const replyMessage = `\`\`\`\n${Object.keys(cCommandMap).reduce(
			(acc, key) => `${acc}\n${key.padEnd(9, ' ')} ${cCommandMap[key]}`,
			''
		)}\`\`\``;
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
	const channelArabia = client.channels.cache.get(process.env.CHANNEL_ARABIA_ID);
	// const channelTest = client.channels.cache.get(process.env.CHANNEL_TEST_ID);
	// (channelArabia as any).send(
	// 	`@everyone\n` +
	// 		`:bell:重大公告：__**即時戰報:horse:**__ 功能上線！\n` +
	// 		`親愛的步兵們，\n` +
	// 		`我非常興奮地宣佈，我現在擁有一個嶄新的功能！我將__每五分鐘__抓取大家的即時遊玩結果，並將它們發布在頻道裡，讓我們隨時~~監視~~關注彼此的進步。\n\n` +
	// 		`這個新功能將帶來更多的互動和娛樂，並且讓我們更貼近彼此的遊戲體驗。我也鼓勵您可以在頻道中分享您的遊玩成績、遊戲時刻和勝利，讓我們一起見證彼此的遊戲冒險。\n\n` +
	// 		`PS. 有任何指令上的問題請輸入 \`!commands\``
	// );
	//#region 定期抓比賽資料
	const cRecordedGameIds: string[] = ['257704343'];
	setInterval(async () => {
		const replyMessage = await getRealTimeMatches(Object.values(cProfileIdMap), cRecordedGameIds);
		console.log(cRecordedGameIds);
		if (replyMessage.length > 0) (channelArabia as any).send(replyMessage);
	}, 1000 * 60 * 5);
	//#endregion
});
client.login(process.env.DISCORD_TOKEN);
