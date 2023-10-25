import React, { Suspense } from 'react';
import { UserConsumer } from 'frontend/contexts/User';
import Skeleton from 'frontend/components/Skeleton';
import { LangDataProvider } from 'frontend/components/Language';

export function MenuSkeleton() {
	return <Skeleton count={4} width={70} />;
}

export default function Menu({ afterLogin: AfterLogin, beforeLogin: BeforeLogin, loadingDisplay }) {
	let finalLoadingDisplay = loadingDisplay ? loadingDisplay : <MenuSkeleton />;

	return (
		<Suspense fallback={finalLoadingDisplay}>
			<LangDataProvider fallback={finalLoadingDisplay} category="menu">
				<nav>
					<UserConsumer>
						{({ userState }) =>
							userState.isLoading ? (
								finalLoadingDisplay
							) : userState.isLogin ? (
								<AfterLogin />
							) : (
								<BeforeLogin />
							)
						}
					</UserConsumer>
				</nav>
			</LangDataProvider>
		</Suspense>
	);
}
