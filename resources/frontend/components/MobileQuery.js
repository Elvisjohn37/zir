import React from 'react';
import MediaQuery from 'react-responsive';
import styles from './MobileQuery.module';

export default function MobileQuery({ children }) {
	return (
		<MediaQuery maxWidth={styles.main_tablet}>
			{(props) => {
				return children(props);
			}}
		</MediaQuery>
	);
}
