import dayjs from 'dayjs';
import { civilizations, getMatchDetailListEndPoint, getMatchListEndPoint, mapTypes } from '../const';
import { formatDateString } from '../utils';

export const cResultDisplay = {
	Win: '✅',
	Loss: '❌',
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
		const matchList = matchListResponse.matchList || [];
		const playLists = await Promise.all<GameData[]>(
			matchList.map(({ gameId }) =>
				fetch(getMatchDetailListEndPoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json; charset=utf-8' },
					body: JSON.stringify({ gameId: gameId, profileId: profile_id }),
				}).then((res) => res.json())
			)
		);
		matchList.forEach((match) => {
			stats.matches.push({
				timeAt: match.dateTime ? dayjs(match.dateTime).add(8, 'hour').toDate() : null,
				winLoss: match.winLoss,
				civilization:
					match.civilization === 'Unknown'
						? null
						: typeof match.civilization === 'string'
						? match.civilization.trim()
						: match.civilization,
				gameId: match.gameId,
			});
		});
		return (
			`斥侯回報 🔔\n\n` +
			stats.matches.reduce((prev, { civilization, gameId, winLoss, timeAt }) => {
				const { matchSummary, playerList } = playLists.find(({ matchSummary }) => matchSummary.gameId === gameId) || {};
				const civ = `\`` + (civilizations[civilization] ?? '未知') + `\``;
				const mapType = `\`` + (mapTypes[matchSummary?.mapType] || matchSummary?.mapType) + `\``;
				const winTeam = (playerList || []).filter(({ winLoss }) => winLoss === 'Win');
				const loseTeam = (playerList || []).filter(({ winLoss }) => winLoss === 'Loss');
				const winTeamDisplay = winTeam
					?.map(({ userName, civName }) => `+ ${userName} ${civilizations[civName.trim()] ?? civName.trim()}`)
					.join('\n');
				const loseTeamDisplay = loseTeam
					?.map(({ userName, civName }) => `- ${userName} ${civilizations[civName.trim()] ?? civName.trim()}`)
					.join('\n');
				prev += `${cResultDisplay[winLoss]} 文明: ${civ.padEnd(8, '\u3000')} 地圖: ${mapType.padEnd(
					8,
					'\u3000'
				)} 時間: *__${formatDateString(new Date(timeAt))}__*\n\`\`\`diff\n${winTeamDisplay}\n${loseTeamDisplay}\`\`\`\n`;
				return prev;
			}, '')
		);
	} catch (error) {
		console.error(error);
		return '斥侯回報 🔔\n抱歉，我找不到你的資料';
	}
}
/** 玩家狀態 */
export interface PlayerStats {
	name: string | null;
	matches: Array<{
		timeAt: Date;
		winLoss: 'Win' | 'Loss';
		civilization: string;
		gameId: string;
	}>;
}

interface MatchSummary {
	gameId: string;
	profileId: number;
	userName: string | null;
	avatarUrl: string | null;
	dateTime: string;
	matchLength: number;
	playerCount: number;
	victoryResultID: number;
	mapType: string;
	civilizationID: number;
	civilization: string | null;
	winLoss: string | null;
}

export interface Player {
	userId: string;
	profileId: number;
	userName: string;
	avatarUrl: string;
	elo: number | null;
	playerStanding: number;
	isHuman: boolean;
	team: number;
	civName: string;
	winLoss: string;
	matchReplayAvailable: boolean;
}

export interface GameData {
	matchSummary: MatchSummary;
	playerList: Player[];
}
