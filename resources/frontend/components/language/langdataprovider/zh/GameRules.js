import React from 'react';
import NestedIntlProvider from 'frontend/components/NestedIntlProvider';

const MESSAGES = {
	game_rules: '游戏规则',
	applicability: {
		title: '本规则适用范围',
		description1:
			'以下游戏的具体规则（以下简称“游戏规则” ）适用于最终用户（以下简称“玩家” ， ' +
			'“你”或“你们” ）对所有运营商（或 SBOBET 网上娱乐场）交互式赌场的产品和服务（以下简称“娱乐场游戏“ ）',
		description2: 'http://casino.sbobet.com ',
		description3:
			'（以下简称”网站“ ）的使用。这些游戏规则是运营商附带条款的一部分。这些附带条款适用于' +
			'运营商提供的所有娱乐场游戏，玩家在任何娱乐场游戏注册时，都必须接受这些条款。如果游戏规则和附带条款有' +
			'任何不一致的地方，以附带条款为准。',
	},
	general_rules: '一般游戏规则',
	liability: {
		title: '责任和义务',
		description: '不论玩家在玩游戏的过程中出现任何情况，玩家都无权对娱乐场的开发商有任何不利的行为。',
	},
	playForFun: {
		title: '为娱乐而游戏',
		description:
			'玩家必须同意，娱乐场游戏仅供娱乐。玩家应理解并认识到，参加娱乐场游戏不一定必须赌钱。' +
			'如果玩家仅想游戏不想赌钱，他们可以在“演示播放”区域内进行。',
	},
	personalUse: {
		title: '仅供个人使用',
		description: '玩家对娱乐场及其网站的兴趣是基于个人而非基于某种专业目的。玩家应仅仅是出',
	},
	malfunctions: {
		title: '故障',
		description:
			'除非另有说明，以下（如某些真人游戏）的任何故障（软件或硬件）将导致游戏无效。' +
			'这意味着不论有任何结果，任何赌注都将返还。',
	},
	smartPlayer: {
		title: '作弊玩家和人工智能插件',
		description:
			'SBOBET 赌场将保留权利拒绝作弊玩家的投注或监视作弊玩家和赌台。 ' +
			'SBOBET 赌场不容许任何作弊玩家和使用人工智能插件的行径， 任何尝试违反和侵犯该条例的玩家，' +
			'账户将会被停用和删除。其彩金也会被没收。',
	},
	complaintsRng: {
		title: '对随机生产数字游戏的投诉',
		description1:
			'如果玩家对娱乐场游戏有任何方面的投诉（现场娱乐场游戏除外，其投诉程序如下） ，' + '他们应该在事发14天内向 ',
		description2: 'support@sbobet.com ',
		description3:
			' 提交投诉，提交的投诉应包括其用户名，' +
			'游戏的日期和时间及任何进一步的有关资料。请注意，经营者将会通过服务器上的数据全面调查这项投诉，' +
			'但对投诉的最终决定在于经营者合理地考虑到所有现有的证据。',
	},
	complaintsLg: {
		title: '对现场游戏的投诉',
		description1:
			'如果玩家想对现场娱乐场游戏结果提出申诉或质疑，他们必须向经营者提供其用户名，' +
			'游戏的时间，荷官的名字，赌桌名及出问题的游戏代号，否则经营者无法处理投诉。' +
			'现场娱乐场游戏的视频图像会保存24小时，因此，玩家必须在争执发生的24小时内进行投诉。' +
			'任何24小时后的投诉将会因为没有录像证据而被经营者拒绝。',
		description2: '如有任何争议，玩家确认并同意，经营者的决定是最终并且正式的决定。',
	},
	maxWin: {
		title: '赢利的最高限额',
		description: '任何一天都没有赢利的最高限额',
	},
	liveCasinoGames: {
		title: '现场娱乐场游戏',
		description1:
			'对于现场娱乐场游戏来说，只有那些被所安装的电子传感器设备所探测到的结果才是游戏的游戏结果。' +
			'如果由于某种原因，游戏结果没有被电子传感器检测到或记录到，那么这个结果就被认定是没有发生过，' +
			'而赌注则会被锁死，直到有效结果出现。',
		description2:
			'现场娱乐场的故障规则包括在以下具体的游戏规则中。' +
			'请鼠标左键点击任何游戏的名称来查看各个游戏的特定规则：',
	},
	casinoGames: {
		live_dealer_baccarat: '现场百家乐',
		live_dealer_roulette: '现场轮盘',
		live_dealer_sicbo: '现场骰宝',
		live_dealer_blackjack: '在线庄家 21 点',
		games: 'GAMES',
		slot: 'SLOT',
		card: 'CARD',
		table: 'TABLE',
	},
};

export default function Provider({ children, ...props }) {
	return (
		<NestedIntlProvider {...props} messages={MESSAGES}>
			{children}
		</NestedIntlProvider>
	);
}
