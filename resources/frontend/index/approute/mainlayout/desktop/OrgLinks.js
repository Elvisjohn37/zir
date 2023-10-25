import React from 'react';
import styles from './OrgLinks.module';
import Image from 'frontend/components/Image';
import Button from '@mui/material/Button';
import dataHandlers from './orglinks/orgDataHandlers';
import { injectIntl } from 'react-intl';

export default injectIntl(function OrgLinks({ jurisdiction, intl }) {
	const ORGANIZATIONS = dataHandlers.getOrganizations(jurisdiction);

	return (
		<>
			{ORGANIZATIONS.map((org, index) =>
				org.url ? (
					<Button
						key={index}
						component="a"
						className={styles.item}
						classes={{ label: styles.buttonLabel, root: styles.buttonRoot }}
						href={org.url}
						target="_blank"
						rel={org.name}
						title={intl.messages[org.name]}
					>
						<Image
							scaleRatio={{ width: org.scaleWidth, height: org.scaleHeight }}
							src={org.img}
							className={styles.image}
						/>
					</Button>
				) : (
					<div className={styles.item} key={index} title={intl.messages[org.name]}>
						<Image
							scaleRatio={{ width: org.scaleWidth, height: org.scaleHeight }}
							src={org.img}
							className={styles.image}
						/>
					</div>
				)
			)}
		</>
	);
});
