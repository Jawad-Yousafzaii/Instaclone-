import {Link, useNavigate} from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {useAuthStore} from "@/store/useAuthStore";

export default function ConsumerLayout({children}) {
	const navigate = useNavigate();
	const {user, logout} = useAuthStore();

	const handleLogout = () => {
		logout();
		navigate(ROUTES.AUTH.LOGIN);
	};

	return (
		<ProtectedRoute allowedRoles={[USER_ROLES.CONSUMER]}>
			<div className="bg-gradient-mesh min-h-screen">
				{/* Header */}
				<header className="sticky top-0 z-40 px-6 py-4">
					<div className="mx-auto max-w-7xl">
						<div className="glass rounded-2xl px-6 py-3 shadow-sm">
							<div className="flex items-center justify-between">
								<Link
									to={ROUTES.CONSUMER.FEED}
									className="group flex items-center gap-3"
								>
									<div className="from-accent-pink to-accent-magenta shadow-glow-pink flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-105">
										<svg
											className="h-6 w-6 text-white"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
									<div>
										<h1 className="text-text-primary text-lg font-black tracking-tighter">
											VELORA
										</h1>
										<p className="text-accent-pink text-[10px] font-bold tracking-widest uppercase">
											Explore
										</p>
									</div>
								</Link>

								<Dropdown
									trigger={
										<button className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:bg-black/5">
											<div className="hidden text-right sm:block">
												<p className="text-text-primary text-sm font-semibold">
													{user?.name}
												</p>
												<p className="text-text-tertiary text-xs">
													{user?.email}
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

				<main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
			</div>
		</ProtectedRoute>
	);
}
