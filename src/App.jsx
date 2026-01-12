import {Suspense} from "react";
import {Route, Routes, Navigate} from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/common/scroll-to-top";
import AuthLayout from "./layouts/AuthLayout";
import ConsumerLayout from "./layouts/ConsumerLayout";
import CreatorLayout from "./layouts/CreatorLayout";
import {ROUTES} from "./lib/constants/constants";
import {routes} from "./lib/constants/routes";
import NotFound from "./pages/not-found";
import {useAuthStore} from "./store/useAuthStore";

function LoadingFallback() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
			<div className="flex flex-col items-center gap-4">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
				<p className="text-lg text-white">Loading...</p>
			</div>
		</div>
	);
}

export default function App() {
	const {isAuthenticated, user} = useAuthStore();

	const getLayout = (route) => {
		if (route.layout === "auth") return AuthLayout;
		if (route.layout === "creator") return CreatorLayout;
		if (route.layout === "consumer") return ConsumerLayout;
		return null;
	};

	return (
		<Suspense fallback={<LoadingFallback />}>
			<ScrollToTop />
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							user?.role === "creator" ? (
								<Navigate to={ROUTES.CREATOR.DASHBOARD} replace />
							) : (
								<Navigate to={ROUTES.CONSUMER.FEED} replace />
							)
						) : (
							<Navigate to={ROUTES.AUTH.LOGIN} replace />
						)
					}
				/>

				{routes.map((route, key) => {
					const Layout = getLayout(route);
					const element = route.isPrivate ? (
						<ProtectedRoute allowedRoles={route.allowedRoles}>
							{route.element}
						</ProtectedRoute>
					) : (
						route.element
					);

					return (
						<Route
							key={key}
							path={route.path}
							element={
								Layout ? (
									<Suspense fallback={<LoadingFallback />}>
										<Layout>{element}</Layout>
									</Suspense>
								) : (
									<Suspense fallback={<LoadingFallback />}>{element}</Suspense>
								)
							}
						/>
					);
				})}

				<Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
			</Routes>
		</Suspense>
	);
}
