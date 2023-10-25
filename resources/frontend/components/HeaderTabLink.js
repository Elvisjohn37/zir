import React from 'react';
import { LangDataProvider } from 'frontend/components/Language';
import Skeleton from 'frontend/components/Skeleton';
import { Button } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './HeaderTabLink.module';
import { UserConsumer } from 'frontend/contexts/User';
import { LayoutConsumer } from 'frontend/contexts/Layout';

export default function HeaderTabLink() {
	return (
		<LayoutConsumer>
			{({ layoutState }) => (
				<UserConsumer>
					{({ userState }) => (
						<LangDataProvider fallback={<Skeleton count={2} width={70} />} category="headertablink">
							<Button
								component="a"
								variant="outlined"
								classes={{ root: styles.link }}
								href={userState.isLogin ? '/sports' : layoutState.config.menuSportsBSI}
								target="_blank"
							>
								<FormattedMessage id="sports" />
							</Button>
						</LangDataProvider>
					)}
				</UserConsumer>
			)}
		</LayoutConsumer>
	);
}
