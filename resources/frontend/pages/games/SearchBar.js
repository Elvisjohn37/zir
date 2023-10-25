import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import styles from './SearchBar.module';
import { eventDelay } from 'frontend/utils/helper';
import { injectIntl } from 'react-intl';
import { Search } from 'frontend/components/Icons';
import classnames from 'classnames';
import { isEmpty } from 'frontend/utils/helper';

let SearchBar = injectIntl(({ onChange, intl, toggable, value }) => {
	let searchInputRef = React.useRef();
	let [isActive, setIsActive] = useState(false);

	function onChangeWrapper() {
		onChange({ target: { value: searchInputRef.current.value } });
	}

	return (
		<>
			<Paper
				elevation={0}
				className={classnames([
					styles.searchPaper,
					toggable && styles.toggable,
					isActive || !isEmpty(value) ? styles.active : styles.inactive,
				])}
			>
				<div className={styles.searchInputContainer}>
					<InputBase
						inputRef={searchInputRef}
						placeholder={intl.messages['searchGame']}
						className={styles.searchInput}
						onKeyUp={() => {
							eventDelay(onChangeWrapper, 'gameSearch');
						}}
						onFocus={() => setIsActive(true)}
						onBlur={() => setIsActive(false)}
						size="small"
					/>
				</div>
				<div className={styles.searchButtonContainer}>
					<IconButton onClick={onChangeWrapper} className={styles.searchButton} size="small">
						<Search className={styles.searchIcon} />
					</IconButton>
				</div>
			</Paper>
			{toggable && (
				<Search
					className={classnames([styles.searchIconPlaceholder, isActive ? styles.active : styles.inactive])}
				/>
			)}
		</>
	);
});

export default SearchBar;
