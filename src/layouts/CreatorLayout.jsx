import {Link, useNavigate} from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import {ROUTES} from "@/lib/constants/constants";
import {USER_ROLES} from "@/lib/constants/constants";
import {useAuthStore} from "@/store/useAuthStore";

export default function CreatorLayout({children}) {
	const navigate = useNavigate();
	const {user, logout} = useAuthStore();

	const handleLogout = () => {
		logout();
		navigate(ROUTES.AUTH.LOGIN);
	};

	return (
		<ProtectedRoute allowedRoles={[USER_ROLES.CREATOR]}>
			<div className="bg-gradient-mesh min-h-screen">
				{/* Simplified Header - Consolidated View */}
				<header className="sticky top-0 z-40 px-6 py-4">
					<div className="mx-auto max-w-7xl">
						<div className="glass rounded-2xl px-6 py-3">
							<div className="flex items-center justify-between">
								{/* Logo - Typography Only for Creator side */}
								<Link
									to={ROUTES.CREATOR.DASHBOARD}
									className="group flex items-center gap-3"
								>
									<div className="from-accent-pink to-accent-magenta shadow-glow-pink flex h-10 items-center justify-center rounded-xl bg-gradient-to-br px-3 transition-transform group-hover:scale-105">
										<span className="text-sm font-black tracking-tighter text-white">
											AURA
										</span>
									</div>
									<div className="hidden sm:block">
										<h1 className="text-text-primary text-lg font-black tracking-tighter">
											VELORA
										</h1>
										<p className="text-accent-pink text-[10px] font-bold tracking-widest uppercase">
											Studio
										</p>
									</div>
								</Link>

								{/* Mobile/Empty nav space removed */}

								{/* User Menu */}
								<Dropdown
									trigger={
										<button className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-black/5">
											<div className="hidden text-right sm:block">
												<p className="text-text-primary text-sm font-semibold">
													{user?.name}
												</p>
												<p className="text-text-tertiary text-xs">
													Creator Account
												</p>
											</div>
											<Avatar src={user?.avatar} name={user?.name} size="md" />
										</button>
									}
									align="right"
								>
									<div className="px-4 py-3">
										<p className="text-text-primary text-sm font-bold">
											{user?.name}
										</p>
										<p className="text-text-tertiary text-xs">{user?.email}</p>
									</div>

									<Dropdown.Divider />

									<Dropdown.Item
										onClick={handleLogout}
										className="text-accent-magenta font-semibold"
									>
										Logout
									</Dropdown.Item>
								</Dropdown>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content - Full Width */}
				<main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
			</div>
		</ProtectedRoute>
	);
}
