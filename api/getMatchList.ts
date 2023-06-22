import { getMatchListEndPoint } from '../const';

const cResultDisplay = {
	Win: '勝',
	Loss: '敗',
};

/**
 * 查詢積分
 * @param profileIdMap 使用者名稱對應的 profileId
 * @param userName 使用者名稱
 * @param isSolo 是否為單人對戰
 * @returns 積分資訊
 */
export async function getMatchList(profileIdMap: Record<string, string>, userName: string, isSolo: boolean): Promise<string> {
	const profile_id = profileIdMap[Object.keys(profileIdMap).find((key) => new RegExp(`^${key}`).test(userName)) as string];
	if (!profile_id) return '抱歉，我不認識你';
	const stats: PlayerStats = {
		name: null,
		matches: [],
	};
	try {
		const response = await fetch(getMatchListEndPoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify({
				profileId: profile_id,
				matchType: isSolo ? '3' : '4',
			}),
		});
		if (!response.ok) {
			return '斥侯回報 🔔\n抱歉，我找不到你的資料';
		}
		const matchListResponse = await response.json();
		(matchListResponse.matchList || []).forEach((match) => {
			stats.matches.push({
				timeAt: match.dateTime ? match.dateTime : null,
				winLoss: match.winLoss,
			});
		});
		return (
			`斥侯回報 🔔\n\n` +
			stats.matches.reduce((prev, match) => {
				prev += `__${new Date(match.timeAt).toLocaleString()}__ ${cResultDisplay[match.winLoss]}\n`;
				return prev;
			}, '')
		);
	} catch (error) {
		console.error(error);
		return '斥侯回報 🔔\n抱歉，我找不到你的資料';
	}
}
/** 玩家狀態 */
interface PlayerStats {
	name: string | null;
	matches: Array<{
		timeAt: Date;
		winLoss: 'Win' | 'Loss';
	}>;
}
