import React, { Suspense } from 'react';
import Skeleton from 'frontend/components/Skeleton';
import classnames from 'classnames';
import BreadCrumb from 'frontend/components/BreadCrumb';
import ErrorBoundary from 'frontend/components/ErrorBoundary';
import styles from './Desktop.module';
import Footer from './desktop/Footer';
import withSuspense from 'frontend/utils/withSuspense';
import Grid from '@mui/material/Grid';
import Image from 'frontend/components/Image';
import mastercard from 'frontend/assets/images/banks/mastercard.png';
import maestro from 'frontend/assets/images/banks/maestro.png';
import neteller from 'frontend/assets/images/banks/neteller.png';
import skrill from 'frontend/assets/images/banks/skrill.png';
import wiretransfer from 'frontend/assets/images/banks/wiretransfer.png';
import visa from 'frontend/assets/images/banks/visa.png';
import visa_electro from 'frontend/assets/images/banks/visa_electro.png';
import { LangDataProvider } from 'frontend/components/Language';

let OrgLinks = React.lazy(function () {
	return import('./desktop/OrgLinks');
});

let DesktopHeader = withSuspense(
	React.lazy(function () {
		return import('./desktop/DesktopHeader');
	})
);

const BANKS = [mastercard, maestro, neteller, skrill, wiretransfer, visa, visa_electro];

export default function Desktop({ children, userState }) {
	return (
		<>
			<header className={classnames([styles.header, userState.isLogin && styles.headerLogin])}>
				<DesktopHeader />
			</header>
			<section className={classnames([styles.body, userState.isLogin && styles.bodyLogin])}>
				<div className={styles.bodyContentBg}>
					<div className={styles.bodyBottomShadow}></div>
				</div>
				<div className={styles.container}>
					<div className={styles.children}>
						<div className={styles.breadcrumbContainer}>
							<ErrorBoundary>
								<BreadCrumb />
							</ErrorBoundary>
						</div>
						<ErrorBoundary>{children}</ErrorBoundary>
					</div>
				</div>
			</section>
			<footer className={classnames([styles.footer, userState.isLogin && styles.footerLogin])}>
				<LangDataProvider category="footer">
					<div className={styles.banks}>
						{BANKS.map((bank, index) => (
							<div className={styles.bank} key={index}>
								<Image scaleRatio={{ width: 130, height: 80 }} src={bank} className={styles.image} />
							</div>
						))}
					</div>
					<div className={styles.footerContainer}>
						<div className={styles.footerContent}>
							<Grid container spacing={1} alignItems="center">
								<Grid item xs={4}>
									<div className={styles.orgLinksContainer}>
										<ErrorBoundary>
											<Suspense
												fallback={<Skeleton count={2} width={50} height={50} className={styles.orgLinksLoader} />}
											>
												{userState.isLogin ? (
													<OrgLinks jurisdiction={userState.user.jurisdiction} />
												) : (
													<OrgLinks jurisdiction={'BSI'} />
												)}
											</Suspense>
										</ErrorBoundary>
									</div>
								</Grid>
								<Grid item xs={8}>
									<ErrorBoundary>
										<Footer />
									</ErrorBoundary>
								</Grid>
							</Grid>
						</div>
					</div>
				</LangDataProvider>
			</footer>
		</>
	);
}
