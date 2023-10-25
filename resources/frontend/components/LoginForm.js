import React, { useRef, useState, useEffect } from 'react';
import styles from './LoginForm.module';
import Skeleton from 'frontend/components/Skeleton';
import SeamlessIframe from 'frontend/components/SeamlessIframe';
import { checkIsMaintenance } from 'frontend/ajax/backend';
import Alert from '@mui/material/Alert';
import { FormattedMessage } from 'react-intl';
import { LangDataProvider } from 'frontend/components/Language';
import { LayoutConsumer } from 'frontend/contexts/Layout';

export function LoginSkeleton() {
	return <Skeleton count={3} width={70} height={25} />;
}

export default function HeaderLoginForm() {
	let iframeRef = useRef();
	let [isContentLoading, setIsContentLoading] = useState(true);
	let [isMaintenance, setIsMaintenance] = useState(null);

	useEffect(() => {
		if (isMaintenance === null) {
			checkIsMaintenance((response) => {
				setIsMaintenance(response.data.data);
			});
		}
	});

	return (
		<LayoutConsumer>
			{({ layoutState }) =>
				isMaintenance === true ? (
					<div className={styles.maintenanceDisplay}>
						<Alert severity="warning">
							<LangDataProvider category="errormessage">
								<FormattedMessage id={`ERR_00029.message`} />
							</LangDataProvider>
						</Alert>
					</div>
				) : (
					<div className={styles.content}>
						{isMaintenance === null || layoutState.loading ? (
							<LoginSkeleton />
						) : (
							<>
								{isContentLoading && <LoginSkeleton />}
								<SeamlessIframe
									scrolling="no"
									src={layoutState.config.sboIframeLogin}
									ref={iframeRef}
									width={406}
									marginWidth="0"
									marginHeight="0"
									height="34"
									frameBorder="0"
									onLoad={() => {
										iframeRef.current.resize();
										setIsContentLoading(false);
									}}
								/>
							</>
						)}
					</div>
				)
			}
		</LayoutConsumer>
	);
}
