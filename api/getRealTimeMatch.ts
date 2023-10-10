import dayjs from 'dayjs';
import { civilizations, getMatchDetailListEndPoint, getMatchListEndPoint, mapTypes } from '../const';
import { formatDateString } from '../utils';
import { PlayerStats, cResultDisplay } from './getMatchList';

/**
 * 查詢24小時內的即時比賽結果
 * @param profileIds 要查詢的 profileId
 * @param recordedGameIds 已紀錄的比賽 id
 * @returns 比賽結果
 */
export async function getRealTimeMatches(profileIds: string[], recordedGameIds: string[]): Promise<string> {
	try {
		const responses = [];
		for await (const profileId of profileIds) {
			const soloGame = await fetch(getMatchListEndPoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					profileId: profileId,
					matchType: '3',
				}),
			});
			await delay(1000);
			const teamGame = await fetch(getMatchListEndPoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
				body: JSON.stringify({
					profileId: profileId,
					matchType: '4',
				}),
			});
			responses.push(soloGame, teamGame);
		}
		if (responses.some((response) => !response.ok)) {
			return '';
		}
		const matchListResponses = (await Promise.all(responses.map((response) => response.json()))).map((response, index) => ({
			...response,
			profileId: profileIds[Math.floor(index / 2)],
		}));
		const matchList = matchListResponses.reduce((prev, response) => {
			if (
				Array.isArray(response.matchList) &&
				response.matchList.length > 0 &&
				!recordedGameIds.includes(response.matchList[0].gameId) &&
				/** 只要 24 小時內的對戰 */
				dayjs().diff(dayjs(response.matchList[0].dateTime), 'hour') - 8 < 24
			) {
				prev.push({ ...response.matchList[0], profileId: response.profileId });
				recordedGameIds.push(response.matchList[0].gameId);
			}
			return prev;
		}, []);
		if (matchList.length <= 0) return '';
		const playLists = [];
		for await (const match of matchList) {
			const response = await fetch(getMatchDetailListEndPoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
				body: JSON.stringify({ gameId: match.gameId, profileId: match.profileId }),
			});
			const matchDetail = await response.json();
			playLists.push(matchDetail);
			await delay(1000);
		}
		const stats: PlayerStats = {
			name: null,
			matches: [],
		};
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
			`即時戰報 🐴🐴🐴\n\n` +
			stats.matches.reduce((prev, { gameId, winLoss, timeAt }) => {
				const { matchSummary, playerList } = playLists.find(({ matchSummary }) => matchSummary.gameId === gameId) || {};
				const mapType = `\`` + (mapTypes[matchSummary?.mapType] || matchSummary?.mapType) + `\``;
				const winTeam = (playerList || []).filter(({ winLoss }) => winLoss === 'Win');
				const loseTeam = (playerList || []).filter(({ winLoss }) => winLoss === 'Loss');
				const winTeamDisplay = winTeam
					?.map(({ userName, civName }) => `+ ${userName} ${civilizations[civName.trim()] ?? civName.trim()}`)
					.join('\n');
				const loseTeamDisplay = loseTeam
					?.map(({ userName, civName }) => `- ${userName} ${civilizations[civName.trim()] ?? civName.trim()}`)
					.join('\n');
				prev += `${cResultDisplay[winLoss]} 地圖: ${mapType.padEnd(8, '\u3000')} 時間: *__${formatDateString(
					new Date(timeAt)
				)}__*\n\`\`\`diff\n${winTeamDisplay}\n${loseTeamDisplay}\`\`\`\n`;
				return prev;
			}, '')
		);
	} catch (error) {
		console.error(error);
		return '';
	}
}

function delay(milliseconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}
