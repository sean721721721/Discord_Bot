'use strict';
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while ((g && ((g = 0), op[0] && (_ = 0)), _))
				try {
					if (
						((f = 1),
						y &&
							(t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, '__esModule', { value: true });
var discord_js_1 = require('discord.js');
var dotenv_1 = require('dotenv');
dotenv_1.config();
var cCommandMap = {
	'!me': '查詢自己的積分',
};
var cProfileIdMap = {
	martren: '5742933',
	sean: '5742909',
	shuo: '4247161',
};
var client = new discord_js_1.Client({
	intents: [
		discord_js_1.IntentsBitField.Flags.Guilds,
		discord_js_1.IntentsBitField.Flags.GuildMessages,
		discord_js_1.IntentsBitField.Flags.MessageContent,
	],
});
client.on('messageCreate', function (message) {
	return __awaiter(void 0, void 0, void 0, function () {
		var replyMessage, replyMessage;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					console.log(message.content);
					if (!(message.content === '!commands')) return [3 /*break*/, 2];
					replyMessage = Object.keys(cCommandMap).reduce(function (acc, key) {
						return ''.concat(acc, '\n').concat(key, ': ').concat(cCommandMap[key]);
					}, '');
					return [4 /*yield*/, message.reply(replyMessage)];
				case 1:
					_a.sent();
					_a.label = 2;
				case 2:
					if (!(message.content === '!me')) return [3 /*break*/, 5];
					return [4 /*yield*/, searchRating(message.author.username)];
				case 3:
					replyMessage = _a.sent();
					return [4 /*yield*/, message.reply(replyMessage)];
				case 4:
					_a.sent();
					_a.label = 5;
				case 5:
					return [2 /*return*/];
			}
		});
	});
});
client.on('ready', function () {
	return __awaiter(void 0, void 0, void 0, function () {
		return __generator(this, function (_a) {
			console.log('Bot is ready!');
			return [2 /*return*/];
		});
	});
});
client.login(process.env.DISCORD_TOKEN);
function searchRating(userName) {
	var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
	return __awaiter(this, void 0, void 0, function () {
		var profile_id, stats, singleRatingResponse, teamRatingResponse, data, data;
		return __generator(this, function (_w) {
			switch (_w.label) {
				case 0:
					profile_id =
						cProfileIdMap[
							Object.keys(cProfileIdMap).find(function (key) {
								return new RegExp('^'.concat(key)).test(userName);
							})
						];
					if (!profile_id) {
						return [2 /*return*/, '抱歉，我不認識你'];
					}
					stats = {
						name: null,
						single: {
							singleRating: null,
							lowestStreak: null,
							highestStreak: null,
							games: null,
							wins: null,
							losses: null,
							drops: null,
							lastMatchTime: null,
						},
						team: {
							teamRating: null,
							lowestStreak: null,
							highestStreak: null,
							games: null,
							wins: null,
							losses: null,
							drops: null,
							lastMatchTime: null,
						},
					};
					return [
						4 /*yield*/,
						fetch('https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=3&profile_id='.concat(profile_id)),
					];
				case 1:
					singleRatingResponse = _w.sent();
					return [
						4 /*yield*/,
						fetch('https://aoe2.net/api/leaderboard?game=aoe2de&leaderboard_id=4&profile_id='.concat(profile_id)),
					];
				case 2:
					teamRatingResponse = _w.sent();
					if (!singleRatingResponse.ok && !teamRatingResponse.ok) {
						return [2 /*return*/, '抱歉，我找不到你的資料'];
					}
					if (!singleRatingResponse.ok) return [3 /*break*/, 4];
					return [4 /*yield*/, singleRatingResponse.json()];
				case 3:
					data = _w.sent();
					stats.name = ((_a = data.leaderboard[0]) === null || _a === void 0 ? void 0 : _a.name) || null;
					stats.single.singleRating = ((_b = data.leaderboard[0]) === null || _b === void 0 ? void 0 : _b.rating) || null;
					stats.single.lowestStreak = ((_c = data.leaderboard[0]) === null || _c === void 0 ? void 0 : _c.lowest_streak) || null;
					stats.single.highestStreak =
						((_d = data.leaderboard[0]) === null || _d === void 0 ? void 0 : _d.highest_streak) || null;
					stats.single.games = ((_e = data.leaderboard[0]) === null || _e === void 0 ? void 0 : _e.games) || null;
					stats.single.wins = ((_f = data.leaderboard[0]) === null || _f === void 0 ? void 0 : _f.wins) || null;
					stats.single.losses = ((_g = data.leaderboard[0]) === null || _g === void 0 ? void 0 : _g.losses) || null;
					stats.single.drops = ((_h = data.leaderboard[0]) === null || _h === void 0 ? void 0 : _h.drops) || null;
					stats.single.lastMatchTime = ((_j = data.leaderboard[0]) === null || _j === void 0 ? void 0 : _j.last_match_time)
						? new Date(
								parseInt(
									''
										.concat((_k = data.leaderboard[0]) === null || _k === void 0 ? void 0 : _k.last_match_time)
										.padEnd(13, '0')
								)
						  ).toLocaleString()
						: null;
					_w.label = 4;
				case 4:
					if (!teamRatingResponse.ok) return [3 /*break*/, 6];
					return [4 /*yield*/, teamRatingResponse.json()];
				case 5:
					data = _w.sent();
					stats.name = ((_l = data.leaderboard[0]) === null || _l === void 0 ? void 0 : _l.name) || null;
					stats.teamRating = ((_m = data.leaderboard[0]) === null || _m === void 0 ? void 0 : _m.rating) || null;
					stats.team.lowestStreak = ((_o = data.leaderboard[0]) === null || _o === void 0 ? void 0 : _o.lowest_streak) || null;
					stats.team.highestStreak = ((_p = data.leaderboard[0]) === null || _p === void 0 ? void 0 : _p.highest_streak) || null;
					stats.team.games = ((_q = data.leaderboard[0]) === null || _q === void 0 ? void 0 : _q.games) || null;
					stats.team.wins = ((_r = data.leaderboard[0]) === null || _r === void 0 ? void 0 : _r.wins) || null;
					stats.team.losses = ((_s = data.leaderboard[0]) === null || _s === void 0 ? void 0 : _s.losses) || null;
					stats.team.drops = ((_t = data.leaderboard[0]) === null || _t === void 0 ? void 0 : _t.drops) || null;
					stats.team.lastMatchTime = ((_u = data.leaderboard[0]) === null || _u === void 0 ? void 0 : _u.last_match_time)
						? new Date(
								parseInt(
									''
										.concat((_v = data.leaderboard[0]) === null || _v === void 0 ? void 0 : _v.last_match_time)
										.padEnd(13, '0')
								)
						  ).toLocaleString()
						: null;
					_w.label = 6;
				case 6:
					if (!stats.name) {
						return [2 /*return*/, '抱歉，我找不到你的資料'];
					}
					return [
						2 /*return*/,
						'\u65A5\u4FAF\u56DE\u5831 \uD83D\uDD14\n\n\u540D\u7A31\n`'
							.concat(stats.name, '`\n\n\u55AE\u4EBA\n```\n\u7A4D\u5206: ')
							.concat(stats.singleRating || '??', '\n\u6700\u9577\u9023\u52DD: ')
							.concat(stats.single.highestStreak || '??', ' \u6700\u5E38\u9023\u6557: ')
							.concat(stats.single.lowestStreak || '??', ' \n\u52DD\u5834: ')
							.concat(stats.single.wins || '??', ' \u6557\u5834: ')
							.concat(stats.single.losses || '??', ' \u65B7\u7DDA: ')
							.concat(stats.single.drops || '??', ' \u7E3D\u5834\u6578: ')
							.concat(stats.single.games || '??', '\n\u6700\u5F8C\u4E00\u5834\u6642\u9593: ')
							.concat(stats.single.lastMatchTime || '??', '\n```\n\u5718\u968A\n```\n\u7A4D\u5206: ')
							.concat(stats.teamRating || '??', '\n\u6700\u9577\u9023\u52DD: ')
							.concat(stats.team.highestStreak || '??', ' \u6700\u5E38\u9023\u6557: ')
							.concat(stats.team.lowestStreak || '??', '\n\u52DD\u5834: ')
							.concat(stats.team.wins || '??', ' \u6557\u5834: ')
							.concat(stats.team.losses || '??', ' \u65B7\u7DDA: ')
							.concat(stats.team.drops || '??', ' \u7E3D\u5834\u6578: ')
							.concat(stats.team.games || '??', '\n\u6700\u5F8C\u4E00\u5834\u6642\u9593: ')
							.concat(stats.team.lastMatchTime || '??', '\n```\n'),
					];
			}
		});
	});
}
