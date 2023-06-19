import { Client, IntentsBitField } from 'discord.js';

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
	console.log(message);
	if (message.content === '!commands') {
		const replyMessage = Object.keys(cCommandMap).reduce((acc, key) => `${acc}\n${key}: ${cCommandMap[key]}`, '');
		await message.reply(replyMessage);
	}
	if (message.content === '!me') {
		const replyMessage = await searchRating(message.author.username);
		await message.reply(replyMessage);
	}
});
client.on('ready', async () => {
	console.log('Bot is ready!');
	const channelArabia = client.channels.cache.get('1119987141624201356');
	channelArabia.send(
		`@everyone 你好，現在可以對我下達以下指令:flushed: \n\`\`\`${Object.keys(cCommandMap).reduce(
			(acc, key) => `${acc}\n${key}: ${cCommandMap[key]}`,
			''
		)}\`\`\``
	);
});
client.login(process.env.DISCORD_TOKEN);
/**
 * 查詢積分
 * @param userName 使用者名稱
 * @returns 積分資訊
 */
async function searchRating(userName: string): Promise<string> {
	const profile_id = cProfileIdMap[Object.keys(cProfileIdMap).find((key) => new RegExp(`^${key}`).test(userName))];
	if (!profile_id) return '抱歉，我不認識你';
	const stats: PlayerStats = {
		name: null,
		single: {
			rating: null,
			lowestStreak: null,
			highestStreak: null,
			games: null,
			wins: null,
			losses: null,
			drops: null,
			lastMatchTime: null,
		},
		team: {
			rating: null,
			lowestStreak: null,
			highestStreak: null,
			games: null,
			wins: null,
			losses: null,
			drops: null,
			lastMatchTime: null,
		},
	};
	const singleRatingResponse = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&profile_id=${profile_id}`);
	const teamRatingResponse = await fetch(`https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=4&profile_id=${profile_id}`);
	if (!singleRatingResponse.ok && !teamRatingResponse.ok) {
		return '抱歉，我找不到你的資料';
	}
	if (singleRatingResponse.ok) {
		const data = await singleRatingResponse.json();
		stats.name = data.leaderboard[0]?.name || null;
		stats.single.rating = data.leaderboard[0]?.rating || null;
		stats.single.lowestStreak = data.leaderboard[0]?.lowest_streak || null;
		stats.single.highestStreak = data.leaderboard[0]?.highest_streak || null;
		stats.single.games = data.leaderboard[0]?.games || null;
		stats.single.wins = data.leaderboard[0]?.wins || null;
		stats.single.losses = data.leaderboard[0]?.losses || null;
		stats.single.drops = data.leaderboard[0]?.drops || null;
		stats.single.lastMatchTime = data.leaderboard[0]?.last_match_time
			? new Date(parseInt(`${data.leaderboard[0]?.last_match_time}`.padEnd(13, '0'))).toLocaleString()
			: null;
	}
	if (teamRatingResponse.ok) {
		const data = await teamRatingResponse.json();
		stats.name = data.leaderboard[0]?.name || null;
		stats.team.rating = data.leaderboard[0]?.rating || null;
		stats.team.lowestStreak = data.leaderboard[0]?.lowest_streak || null;
		stats.team.highestStreak = data.leaderboard[0]?.highest_streak || null;
		stats.team.games = data.leaderboard[0]?.games || null;
		stats.team.wins = data.leaderboard[0]?.wins || null;
		stats.team.losses = data.leaderboard[0]?.losses || null;
		stats.team.drops = data.leaderboard[0]?.drops || null;
		stats.team.lastMatchTime = data.leaderboard[0]?.last_match_time
			? new Date(parseInt(`${data.leaderboard[0]?.last_match_time}`.padEnd(13, '0'))).toLocaleString()
			: null;
	}
	if (!stats.name) {
		return '抱歉，我找不到你的資料';
	}
	const { single, team } = stats;
	const singleData = `積分: ${single.rating || '??'}\n最長連勝: ${single.highestStreak || '??'} 最常連敗: ${
		single.lowestStreak || '??'
	}\n勝場: ${single.wins || '??'} 敗場: ${single.losses || '??'} 斷線: ${single.drops || '??'} 總場數: ${
		single.games || '??'
	}\n最後一場時間: ${single.lastMatchTime || '??'}`;

	const teamData = `積分: ${team.rating || '??'}\n最長連勝: ${team.highestStreak || '??'} 最常連敗: ${team.lowestStreak || '??'}\n勝場: ${
		team.wins || '??'
	} 敗場: ${team.losses || '??'} 斷線: ${team.drops || '??'} 總場數: ${team.games || '??'}\n最後一場時間: ${team.lastMatchTime || '??'}`;

	return `斥侯回報 🔔\n\n名稱\n\`${stats.name}\`\n\n單人\n\`\`\`${singleData}\`\`\`團隊\`\`\`${teamData}\`\`\``;
}
/** 玩家狀態 */
interface PlayerStats {
	name: string;
	single: {
		rating: number;
		lowestStreak: number;
		highestStreak: number;
		games: number;
		wins: number;
		losses: number;
		drops: number;
		lastMatchTime: string;
	};
	team: {
		rating: number;
		lowestStreak: number;
		highestStreak: number;
		games: number;
		wins: number;
		losses: number;
		drops: number;
		lastMatchTime: string;
	};
}
