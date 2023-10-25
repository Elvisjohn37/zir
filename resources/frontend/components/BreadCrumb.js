import React, { Suspense } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { LangDataProvider } from 'frontend/components/Language';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import styles from './BreadCrumb.module';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';
import Skeleton from 'frontend/components/Skeleton';
import MediaQuery from 'react-responsive';

let withSuspense = (Component) =>
	function WithSuspense(props) {
		return (
			<Suspense fallback={<Skeleton width={50} height={32} />}>
				<Component {...props} />
			</Suspense>
		);
	};

let Root = withSuspense(
	withSuspense(
		React.lazy(function () {
			return import('./breadcrumb/Root');
		})
	)
);

let Default = withSuspense(
	withSuspense(
		React.lazy(function () {
			return import('./breadcrumb/Default');
		})
	)
);

const ROUTES = [
	{ path: '/', breadcrumb: Root },
	{ path: '/games/:type?', breadcrumb: null },
	{ path: '/account/archived-report/statement/:type/:date', breadcrumb: null },
	{ path: '/account/archived-report/statement/:type/:productID/:date', breadcrumb: null },
	{ path: '*', breadcrumb: Default },
];

export default function BreadCrumb() {
	let breadcrumbs = useBreadcrumbs(ROUTES);
	let breadcrumbsLength = breadcrumbs.length;

	return (
		breadcrumbsLength > 2 && (
			<LangDataProvider category="menu">
				<LangDataProvider category="submenu">
					<MediaQuery maxDeviceWidth={styles.main_mobile}>
						{(matches) => (
							<Breadcrumbs
								maxItems={matches ? 2 : 3}
								itemsBeforeCollapse={0}
								itemsAfterCollapse={2}
								aria-label="breadcrumb"
								className={styles.breadcrumb}
								classes={{ separator: styles.separator }}
								separator={<NavigateNextIcon className={styles.separatorIcon} />}
							>
								{breadcrumbs.map(({ breadcrumb, location, match }, index) => {
									return (
										(breadcrumb.key != '/' || location.pathname == '/') &&
										(index + 1 != breadcrumbsLength ? (
											<Button
												className={styles.link}
												component={NavLink}
												key={index}
												to={match.url}
											>
												<span className={styles.text}>{breadcrumb}</span>
											</Button>
										) : (
											<span className={classnames([styles.text, styles.nolink])} key={index}>
												{breadcrumb}
											</span>
										))
									);
								})}
							</Breadcrumbs>
						)}
					</MediaQuery>
				</LangDataProvider>
			</LangDataProvider>
		)
	);
}
