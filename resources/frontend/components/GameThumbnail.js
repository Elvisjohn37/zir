import React, { useState, useRef } from 'react';
import ErrorBoundary from 'frontend/components/ErrorBoundary';
import noThumbnail from 'frontend/assets/images/games/nothumbnail.jpg';
import Button from '@mui/material/Button';
import { FormattedMessage } from 'react-intl';
import { gameOnClick } from 'frontend/utils/gameHelper';
import styles from './GameThumbnail.module';
import { Tab } from '@mui/material';
import Image from 'frontend/components/Image';
import Skeleton from 'frontend/components/Skeleton';
import classnames from 'classnames';
import { range } from 'lodash';
import { createTransparentImage } from 'frontend/utils/helper';
import { LangDataProvider } from 'frontend/components/Language';
import { UserConsumer } from 'frontend/contexts/User';
import GameCertifiedDialog from 'frontend/components/GameCertifiedDialog';
import topTag from 'frontend/assets/images/games/toptag.png';
import Grid from '@mui/material/Grid';
import { eventDelay } from 'frontend/utils/helper';
import MobileQuery from 'frontend/components/MobileQuery';
import topBlueBg from 'frontend/assets/images/games/topbluebg.svg';

export default function GameThumbnailWithState(props) {
	return (
		<MobileQuery>
			{(matches) => (
				<UserConsumer>
					{({ userState }) => (
						<LangDataProvider category="gamelobby">
							<GameThumbnail {...props} userState={userState} matches={matches} />
						</LangDataProvider>
					)}
				</UserConsumer>
			)}
		</MobileQuery>
	);
}

let GameThumbnail = React.forwardRef(function GameThumbnail(
	{ game, children, className, isDisplayFlag, userState, isDisableClick, matches },
	ref
) {
	isDisableClick = isDisableClick || false;
	let timerRef = useRef();
	let isMouseOverRef = useRef(false);
	let isDisableClickRef = useRef(false);
	let [loadPreview, setLoadPreview] = useState(false);
	let [isNotCertPopup, setIsNotCertPopup] = useState(false);
	isDisplayFlag = isDisplayFlag ? true : false;

	function startPressTimer() {
		timerRef.current = setTimeout(() => {
			isDisableClickRef.current = true;
		}, 500);
	}

	let isShowPreview = loadPreview && game.isPreviewEnabled;

	function loadPreviewHandler() {
		setLoadPreview(true);
	}

	function handleMouseDown() {
		isMouseOverRef.current = true;
	}

	function handleMouseUp(event) {
		if (!isDisableClickRef.current && event.button != 2 && !isDisableClick) {
			eventDelay(() => openGame(userState.user.jurisdiction), 'gameClick');
		}

		isDisableClickRef.current = false;
		isMouseOverRef.current = false;
	}

	function handleMouseMove() {
		if (isMouseOverRef.current) {
			isDisableClickRef.current = true;
		} else {
			isDisableClickRef.current = false;
		}
	}

	function openGame(userJurisdiction) {
		if (userJurisdiction == 'IOM' && !game.isCertified) {
			setIsNotCertPopup(true);
		} else {
			gameOnClick(game.gameID);
		}
	}

	return (
		<>
			<div
				className={classnames([
					styles.gameItem,
					styles.gameActual,
					className,
					!game.isAvailable && styles.disabled,
					matches ? styles.mobile : styles.desktop,
				])}
				ref={ref}
			>
				<div className={styles.gameItemContainer}>
					{!game.isAvailable ? (
						<div className={styles.notAvailableContainer}>
							<div className={styles.notAvailableContent}>
								<div className={styles.notAvailableText}>
									<FormattedMessage id="notAvailable" />
								</div>
							</div>
						</div>
					) : null}
					<Button
						classes={{ label: styles.gameItemButtonLabel }}
						className={classnames([
							styles.gameItemButton,
							isShowPreview ? styles.hasPreview : styles.hasNoPreview,
						])}
						color="primary"
						onMouseMove={handleMouseMove}
						onTouchMove={handleMouseMove}
						onMouseDown={handleMouseDown}
						onTouchStart={(event) => {
							loadPreviewHandler(event);
							handleMouseDown(event);
							startPressTimer();
						}}
						onMouseUp={handleMouseUp}
						onTouchEnd={(event) => {
							handleMouseUp(event);
							clearTimeout(timerRef.current);
						}}
						onMouseOver={loadPreviewHandler}
						draggable={false}
					>
						<div className={classnames([styles.gameItemWrapper])}>
							{isDisplayFlag && game.isNew === 1 && (
								<div className={styles.newGameTagContainer}>
									<span className={styles.newGameTagContent}>
										<FormattedMessage id="new" />
									</span>
								</div>
							)}
							{isDisplayFlag && game.isTop == 1 && (
								<div className={styles.topGameContainer}>
									<img src={topTag} />
								</div>
							)}
							<div className={styles.gameThumbnailWrap}>
								<ErrorBoundary
									placeholder={
										<Image
											src={noThumbnail}
											scaleRatio={{ width: 350, height: 150 }}
											className={styles.gameThumbnailImg}
											imgProps={{ draggable: false }}
										/>
									}
								>
									<GameThumbImg game={game} />
								</ErrorBoundary>
								{isShowPreview ? (
									<ErrorBoundary placeholder=" ">
										<GameSpriteImg game={game} />
									</ErrorBoundary>
								) : null}
							</div>
							<div className={styles.gameName}>
								<div className={styles.gameNameText}>
									<span>{game.gameName.replaceAll('(Mobile)', '')}</span>
								</div>
							</div>
						</div>
					</Button>
					{children}
				</div>
			</div>
			{userState.user.jurisdiction == 'IOM' && (
				<GameCertifiedDialog gameID={game.gameID} isNotCertPopup={isNotCertPopup} />
			)}
		</>
	);
});

function GameSpriteImg({ game }) {
	let sprite = gamePreview(game.gameProviderID, game.gameName);

	return (
		<Image
			src={sprite}
			scaleRatio={{ width: 350, height: 150 }}
			className={styles.gamePreview}
			onLoadClassName={styles.loaded}
			isLazy={false}
			imgProps={{ draggable: false }}
		/>
	);
}

function GameThumbImg({ game }) {
	let thumbnail = gameThumbnail(game.gameProviderID, game.gameName);

	return (
		<Image
			src={thumbnail}
			scaleRatio={{ width: 350, height: 150 }}
			className={styles.gameThumbnailImg}
			imgProps={{ draggable: false }}
		/>
	);
}

function gameThumbnail(gameProviderID, gameName) {
	let gameFile = gameFileName(gameName);
	return require(`frontend/assets/images/games/thumbnail/${gameProviderID}_${gameFile}.jpg`);
}

function gamePreview(gameProviderID, gameName) {
	let gameFile = gameFileName(gameName);
	return require(`frontend/assets/images/games/preview/${gameProviderID}_${gameFile}.jpg`);
}

function gameFileName(gameName) {
	return gameName
		.replaceAll('(Mobile)', '')
		.replaceAll(/\s/g, '')
		.replaceAll(/[^a-zA-Z0-9]/g, '')
		.toLowerCase();
}

export function GameThumbnailLoader(props) {
	return (
		<MobileQuery>
			{(matches) => (
				<div className={classnames([styles.gameLoader, matches ? styles.mobile : styles.desktop])}>
					<div className={styles.loaderTitle}>
						<Skeleton width={120} height={36} />
					</div>
					<GameThumbnailNoTitleLoader {...props} count={matches ? 3 : 5} spacing={matches ? 1 : 2} />
				</div>
			)}
		</MobileQuery>
	);
}

export function GameThumbnailNoTitleLoader({ count, spacing }) {
	count = count || 5;
	spacing = spacing || 2;
	let display = 12 / count;

	return (
		<Grid container spacing={spacing}>
			{range(count).map((item, index) => (
				<Grid item xs={display} key={index}>
					<div className={styles.gameLoaderItem}>
						<Image
							src={createTransparentImage(350, 150)}
							scaleRatio={{ width: 350, height: 150 }}
							className={styles.gameLoaderImg}
							imgProps={{ draggable: false }}
						/>
						<Skeleton count={1} className={styles.gameLoaderContent} />
					</div>
				</Grid>
			))}
		</Grid>
	);
}

export function GameThumbnailFiller(props) {
	return <Tab className={classnames([styles.gameItem, styles.gameFiller])} {...props} />;
}

export function TopGameThumbnailContainer({ game, index, ...props }) {
	return (
		<MobileQuery>
			{(matches) => (
				<div
					className={classnames([styles.gameThumbnailTopContainer, matches ? styles.mobile : styles.desktop])}
					draggable={false}
				>
					<div className={styles.blueBg}>
						<Image
							src={topBlueBg}
							className={styles.blueBgImg}
							onLoadClassName={styles.loaded}
							scaleRatio={{ width: 469, height: 184 }}
							isLazy={false}
							imgProps={{ draggable: false }}
						/>
					</div>
					<div className={styles.number}>{index + 1}</div>
					<GameThumbnailWithState
						game={game}
						className={styles.gameThumbnail}
						gameType={game.gameTypeName}
						{...props}
					/>
				</div>
			)}
		</MobileQuery>
	);
}
