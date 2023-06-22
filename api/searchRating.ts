import { searchRatingEndPoint } from '../const';

/**
 * 查詢積分
 * @param profileIdMap 使用者名稱對應的 profileId
 * @param userName 使用者名稱
 * @returns 積分資訊
 */
export async function searchRating(profileIdMap: Record<string, string>, userName: string): Promise<string> {
	const profile_id = profileIdMap[Object.keys(profileIdMap).find((key) => new RegExp(`^${key}`).test(userName)) as string];
	if (!profile_id) return '抱歉，我不認識你';
	const stats: PlayerStats = {
		name: null,
		single: {
			rating: null,
			currentWinStreak: null,
			totalMatches: null,
			totalWins: null,
			totalLosses: null,
			drops: null,
			lastMatchTime: null,
		},
		team: {
			rating: null,
			currentWinStreak: null,
			totalMatches: null,
			totalWins: null,
			totalLosses: null,
			drops: null,
			lastMatchTime: null,
		},
	};
	try {
		const [singleRatingResponse, teamRatingResponse] = await Promise.all([
			fetch(searchRatingEndPoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					profileId: profile_id,
					matchType: '3',
				}),
			}),
			fetch(searchRatingEndPoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					profileId: profile_id,
					matchType: '4',
				}),
			}),
		]);
		if (!singleRatingResponse.ok && !teamRatingResponse.ok) {
			return '斥侯回報 🔔\n抱歉，我找不到你的資料';
		}
		if (singleRatingResponse.ok) {
			const data = await singleRatingResponse.json();
			const {
				mpStatList: { currentWinStreak, totalMatches, totalWins },
				user: { userName, elo },
			} = data;
			stats.name = userName || null;
			stats.single.rating = elo || null;
			stats.single.currentWinStreak = typeof currentWinStreak === 'number' ? currentWinStreak : null;
			stats.single.totalMatches = totalMatches || null;
			stats.single.totalWins = totalWins || null;
			stats.single.totalLosses =
				stats.single.totalMatches && stats.single.totalWins ? stats.single.totalMatches - stats.single.totalWins : null;
			// stats.single.lastMatchTime =last_match_time
			// 	? new Date(parseInt(`${user?.last_match_time}`.padEnd(13, '0'))).toLocaleString()
			// 	: null;
		}
		if (teamRatingResponse.ok) {
			const data = await teamRatingResponse.json();
			const {
				mpStatList: { currentWinStreak, totalMatches, totalWins },
				user: { userName, elo },
			} = data;
			stats.name = userName || null;
			stats.team.rating = elo || null;
			stats.team.currentWinStreak = typeof currentWinStreak === 'number' ? currentWinStreak : null;
			stats.team.totalMatches = totalMatches || null;
			stats.team.totalWins = totalWins || null;
			stats.team.totalLosses =
				stats.team.totalMatches && stats.team.totalWins ? stats.team.totalMatches - stats.team.totalWins : null;
			// stats.team.lastMatchTime =last_match_time
			// 	? new Date(parseInt(`${user?.last_match_time}`.padEnd(13, '0'))).toLocaleString()
			// 	: null;
		}
		if (!stats.name) {
			return '抱歉，我找不到你的資料';
		}
		let singleData = '';
		let teamData = '';
		Object.keys(stats).forEach((key) => {
			const statsData = `積分: ${stats[key].rating || '??'} 目前連勝: ${
				typeof stats[key].currentWinStreak === 'number' ? stats[key].currentWinStreak : '??'
			} 勝場: ${stats[key].totalWins || '??'} 敗場: ${stats[key].totalLosses || '??'} 總場數: ${stats[key].totalMatches || '??'}`;
			if (key === 'single') singleData = statsData;
			else if (key === 'team') teamData = statsData;
		});
		return `斥侯回報 🔔\n\n__${stats.name}__\n\`\`\`elm\n單人 ${singleData}\n團隊 ${teamData}\`\`\``;
	} catch (error) {
		console.error(error);
		return '斥侯回報 🔔\n抱歉，我找不到你的資料';
	}
}
/** 玩家狀態 */
interface PlayerStats {
	name: string | null;
	single: {
		rating: number | null;
		currentWinStreak: number | null;
		totalMatches: number | null;
		totalWins: number | null;
		totalLosses: number | null;
		drops: number | null;
		lastMatchTime: string | null;
	};
	team: {
		rating: number | null;
		currentWinStreak: number | null;
		totalMatches: number | null;
		totalWins: number | null;
		totalLosses: number | null;
		drops: number | null;
		lastMatchTime: string | null;
	};
}
