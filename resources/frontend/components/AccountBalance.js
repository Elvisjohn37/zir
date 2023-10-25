import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert } from '@mui/material';
import { AccountBalanceWallet, Refresh } from '@mui/icons-material';
import styles from './AccountBalance.module';
import Skeleton from 'frontend/components/Skeleton';
import { getBalance, getBalanceBackground } from 'frontend/ajax/backend';
import { MoneyFormatToggle } from 'frontend/components/MoneyFormat';
import { UserConsumer } from 'frontend/contexts/User';
import classnames from 'classnames';
import Spinner from 'frontend/components/Spinner';
import { LangDataProvider } from 'frontend/components/Language';
import { subscribe, unsubscribe } from 'frontend/ajax/backend';
import { isEmpty } from 'frontend/utils/helper';

export function AccountBalanceRaw({
	userState,
	userDispatch,
	label,
	format,
	className,
	withRefreshButton,
	isAutoUpdate,
	compactStart,
	initialBalanceInfo,
}) {
	let [isLoading, setIsLoading] = useState(false);
	let [isError, setIsError] = useState(false);
	let [isUpdate, setUpdate] = useState(isEmpty(initialBalanceInfo) ? true : false);
	let [isUpdateOnBackground, setUpdateOnBackground] = useState(isEmpty(initialBalanceInfo) ? true : false);
	let [isMounted, setIsMounted] = useState(false);
	let [timerID, setTimerID] = useState(0);
	let [isSessionTimeout, setIsSessionTimeout] = useState(false);

	function autoUpdate() {
		if (isAutoUpdate) {
			setTimerID(
				setTimeout(() => {
					setUpdateOnBackground(true);
				}, 300000)
			);
		}
	}

	useEffect(() => {
		updateClientBalance(isUpdateOnBackground, getBalanceBackground, setUpdateOnBackground);
	}, [isUpdateOnBackground]);

	useEffect(() => {
		updateClientBalance(isUpdate, getBalance, setUpdate);
	}, [isUpdate]);

	function updateClientBalance(isUpdateBalance, getBalanceRoute, setUpdateBalance) {
		if (isUpdateBalance == true && isSessionTimeout === false) {
			timerID && clearTimeout(timerID);

			if (!isLoading) {
				setIsLoading(true);

				getBalanceRoute(
					(response) => {
						userDispatch({ type: 'SET_USER_DATA', data: response.data.data });
						setIsLoading(false);
						autoUpdate();
					},
					() => {
						setIsError(true);
						setIsLoading(false);
						autoUpdate();
					}
				);
			}

			setUpdateBalance(false);
		}
	}

	function onWindowFocus() {
		setUpdate(true);
	}

	function onWindowBlur() {
		timerID && clearTimeout(timerID);
	}

	function onVisibilityChange() {
		if (document.visibilityState === 'visible') {
			onWindowFocus();
		} else {
			onWindowBlur();
		}
	}

	useEffect(() => {
		if (!isMounted) {
			if (!isEmpty(initialBalanceInfo)) {
				userDispatch({ type: 'SET_USER_DATA', data: initialBalanceInfo });
			}

			setIsMounted(true);
		}

		let errorID = subscribe('error', (response) => {
			let codeProps = response.data.error.code;

			if (codeProps == '-2') {
				setIsSessionTimeout(true);
			}
		});

		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			unsubscribe('error', errorID);
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});

	return (
		<LangDataProvider
			category="errormessage"
			fallback={
				<div className={classnames([styles.accountBalanceTextWrapper, className])}>
					<Skeleton height={30} width={parseInt(styles.main_minWidth) / 2} className={styles.loader} />
				</div>
			}
		>
			<div className={classnames([styles.accountBalanceTextWrapper, className])}>
				{isLoading && !userState.playableBalance ? (
					<Skeleton height={30} width={parseInt(styles.main_minWidth) / 2} className={styles.loader} />
				) : isError ? (
					<Alert
						severity="error"
						variant="filled"
						className={styles.error}
						classes={{ icon: styles.alertIcon, message: styles.alertMessage }}
					>
						<FormattedMessage id="ERR_00031.message" />
					</Alert>
				) : (
					<div className={styles.accountBalanceText}>
						<div className={styles.amountIcon}>
							<AccountBalanceWallet fontSize="inherit" />
						</div>
						<div className={styles.amountText}>
							{label}
							<span className={styles.amountFigure}>
								<FormattedMessage
									id="none"
									defaultMessage={format || '{balance} {currencyCode}'}
									values={{
										balance: (
											<MoneyFormatToggle
												value={userState.playableBalance}
												compactStart={compactStart}
											/>
										),
										currencyCode: userState.currencyCode,
									}}
								/>
							</span>
						</div>
						{withRefreshButton &&
							(isLoading ? (
								<Spinner className={styles.spinner} color="primary" />
							) : (
								<div
									className={styles.amountRefresh}
									onClick={() => {
										setUpdate(true);
									}}
								>
									<Refresh fontSize="inherit" />
								</div>
							))}
					</div>
				)}
			</div>
		</LangDataProvider>
	);
}

export default function AccountBalance(props) {
	return (
		<UserConsumer>
			{({ userDispatch, userState }) => (
				<AccountBalanceRaw userState={userState} userDispatch={userDispatch} {...props} />
			)}
		</UserConsumer>
	);
}
