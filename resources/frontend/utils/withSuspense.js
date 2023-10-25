import React, { Suspense } from 'react';
import { SkeletonFull } from 'frontend/components/Skeleton';

export default function withSuspense(Component, fallback) {
	return function WithSuspense(props) {
		return (
			<Suspense fallback={fallback ? fallback : <SkeletonFull />}>
				<Component {...props} />
			</Suspense>
		);
	};
}
