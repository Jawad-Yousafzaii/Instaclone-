import {Navigate} from "react-router-dom";
import {ROUTES} from "@/lib/constants/constants";
import {useAuthStore} from "@/store/useAuthStore";

export default function ProtectedRoute({children, allowedRoles = []}) {
	const {isAuthenticated, user} = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
	}

	if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
		return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
	}

	return children;
}
