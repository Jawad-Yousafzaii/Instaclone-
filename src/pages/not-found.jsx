import {useNavigate} from "react-router-dom";
import Button from "@/components/ui/Button";
import {ROUTES} from "@/lib/constants/constants";

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

			<div className="relative space-y-6 text-center">
				<div className="space-y-2">
					<h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-9xl font-bold text-transparent">
						404
					</h1>
					<h2 className="text-3xl font-bold text-white">Page Not Found</h2>
					<p className="mx-auto max-w-md text-gray-400">
						The page you're looking for doesn't exist or has been moved.
					</p>
				</div>

				<div className="flex flex-col justify-center gap-4 sm:flex-row">
					<Button variant="primary" onClick={() => navigate(-1)}>
						Go Back
					</Button>
					<Button
						variant="secondary"
						onClick={() => navigate(ROUTES.AUTH.LOGIN)}
					>
						Go to Login
					</Button>
				</div>
			</div>
		</div>
	);
}
