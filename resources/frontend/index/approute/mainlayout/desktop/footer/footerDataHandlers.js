import appendQuery from 'append-query';

function getFooterLink(layoutState) {
	return {
		en: {
			privacyPolicy: layoutState.config.privacyPolicy,
			responsibleGamblingPolicy: layoutState.config.responsibleGamblingPolicy,
			help: appendQuery(layoutState.config.help, 'ln=en'),
		},
		zh: {
			privacyPolicy: layoutState.config.privacyPolicy,
			responsibleGamblingPolicy: layoutState.config.responsibleGamblingPolicy,
			help: appendQuery(layoutState.config.help, 'ln=zh'),
		},
		ko: {
			privacyPolicy: layoutState.config.privacyPolicy,
			responsibleGamblingPolicy: layoutState.config.responsibleGamblingPolicy,
			help: appendQuery(layoutState.config.help, 'ln=ko'),
		},
		th: {
			privacyPolicy: layoutState.config.privacyPolicy,
			responsibleGamblingPolicy: layoutState.config.responsibleGamblingPolicy,
			help: appendQuery(layoutState.config.help, 'ln=th'),
		},
	};
}
export default { getFooterLink };
