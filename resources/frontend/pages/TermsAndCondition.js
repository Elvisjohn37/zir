import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import { FormattedMessage } from 'react-intl';
import styles from './TermsAndCondition.module';
// import classnames from 'classnames';

export default function Home() {
	return (
		<div className={styles.termAndCondition}>
			<LangDataProvider category="termscondition">
				<div className={styles.termAndConditionContent}>
					<h1>
						<FormattedMessage id="terms_condition" />
					</h1>
					<p className={styles.description}>
						<FormattedMessage id="description" />
					</p>
					<ol className={styles.content}>
						<li>
							<FormattedMessage id="content1" />
						</li>
						<li>
							<FormattedMessage id="content2" />
						</li>
					</ol>
				</div>
			</LangDataProvider>
		</div>
	);
}
