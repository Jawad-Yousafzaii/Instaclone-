import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {useAuthStore} from "@/store/useAuthStore";

function HomeIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
		</svg>
	);
}

function SearchIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
		</svg>
	);
}

function ReelsIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
		</svg>
	);
}

function ProfileIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
		</svg>
	);
}

function LogoutIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
		</svg>
	);
}

const NAV_ITEMS = [
	{label: "Home", icon: HomeIcon, to: ROUTES.CONSUMER.FEED, id: "home"},
	{label: "Reels", icon: ReelsIcon, to: ROUTES.CONSUMER.REELS, id: "reels"},
];

export default function ConsumerLayout({children}) {
	const navigate = useNavigate();
	const location = useLocation();
	const {user, logout} = useAuthStore();
	const [collapsed, setCollapsed] = useState(false);

	const isReelsPage = location.pathname === ROUTES.CONSUMER.REELS;

	const handleLogout = () => {
		logout();
		navigate(ROUTES.AUTH.LOGIN);
	};

	const isActive = (item) => {
		if (item.id === "reels") return location.pathname === ROUTES.CONSUMER.REELS;
		if (item.id === "home") return location.pathname === ROUTES.CONSUMER.FEED && !location.search;
		return location.pathname + location.search === item.to;
	};

	return (
		<ProtectedRoute allowedRoles={[USER_ROLES.CONSUMER]}>
			<div className={`flex min-h-screen ${isReelsPage ? "bg-black" : "bg-white"}`}>
				<aside
					className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 border-r ${isReelsPage ? "border-gray-800 bg-black" : "border-[#FFB6C1]/20 bg-white"} transition-all duration-300 ease-in-out ${
						collapsed ? "w-[72px]" : "w-[240px]"
					}`}
				>
					<div className={`flex items-center gap-3 px-4 py-6 ${collapsed ? "justify-center" : ""}`}>
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFB6C1] to-[#f48fb1] shadow-sm">
							<svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
							</svg>
						</div>
						{!collapsed && (
							<div>
								<h1 className={`text-base font-black tracking-tight ${isReelsPage ? "text-white" : "text-gray-900"}`}>LuminaCloud</h1>
								<p className="text-[9px] font-bold uppercase tracking-widest text-[#FFB6C1]">Explore</p>
							</div>
						)}
					</div>

					<nav className="flex flex-col gap-1 px-3 flex-1">
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const active = isActive(item);
							return (
								<Link
									key={item.id}
									to={item.to}
									id={`nav-${item.id}`}
									className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 ${
										collapsed ? "justify-center" : ""
									} ${
										active
											? "bg-[#FFB6C1]/15 font-bold text-[#c2185b]"
											: isReelsPage
												? "text-gray-400 hover:bg-white/10 hover:text-white font-medium"
												: "text-gray-500 hover:bg-[#FFB6C1]/10 hover:text-gray-800 font-medium"
									}`}
								>
									<Icon
										className={`h-6 w-6 shrink-0 ${active ? "text-[#FFB6C1]" : ""}`}
									/>
									{!collapsed && <span className="text-sm">{item.label}</span>}
								</Link>
							);
						})}
					</nav>

					<div
						className={`p-3 border-t ${isReelsPage ? "border-gray-800" : "border-[#FFB6C1]/15"} ${collapsed ? "flex justify-center" : ""}`}
					>
						{!collapsed ? (
							<div className="flex items-center gap-3 rounded-xl px-3 py-3">
								<Avatar src={user?.avatar} name={user?.name} size="sm" />
								<div className="flex-1 min-w-0">
									<p className={`text-sm font-semibold truncate ${isReelsPage ? "text-white" : "text-gray-900"}`}>{user?.name}</p>
									<p className={`text-xs truncate ${isReelsPage ? "text-gray-500" : "text-gray-400"}`}>{user?.email}</p>
								</div>
								<button
									id="sidebar-logout-btn"
									onClick={handleLogout}
									className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
										isReelsPage
											? "text-gray-500 hover:bg-white/10 hover:text-white"
											: "text-gray-400 hover:bg-[#FFB6C1]/15 hover:text-[#c2185b]"
									}`}
									title="Logout"
								>
									<LogoutIcon className="h-4 w-4" />
								</button>
							</div>
						) : (
							<button
								id="sidebar-logout-icon-btn"
								onClick={handleLogout}
								className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
									isReelsPage
										? "text-gray-500 hover:bg-white/10 hover:text-white"
										: "text-gray-400 hover:bg-[#FFB6C1]/15 hover:text-[#c2185b]"
								}`}
								title="Logout"
							>
								<LogoutIcon className="h-5 w-5" />
							</button>
						)}
					</div>

					<button
						id="sidebar-collapse-btn"
						onClick={() => setCollapsed((c) => !c)}
						className={`absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-colors ${
							isReelsPage
								? "border-gray-700 bg-gray-900 text-gray-400 hover:text-white"
								: "border-[#FFB6C1]/30 bg-white text-gray-400 hover:text-[#FFB6C1]"
						}`}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					>
						<svg
							className={`h-3 w-3 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
				</aside>

				<main
					className={`flex-1 min-h-[100dvh] relative transition-all duration-300 ease-in-out ${
						collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
					} pb-16 lg:pb-0`}
				>
					{isReelsPage ? (
						<div className="absolute inset-0 w-full h-[100dvh]">
							{children}
						</div>
					) : (
						<div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
							{children}
						</div>
					)}
				</main>

				<nav className={`fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-around border-t px-2 py-2 backdrop-blur-md ${
					isReelsPage
						? "border-gray-800 bg-black/95"
						: "border-[#FFB6C1]/20 bg-white/95"
				}`}>
					{NAV_ITEMS.map((item) => {
						const Icon = item.icon;
						const active = isActive(item);
						return (
							<Link
								key={item.id}
								to={item.to}
								id={`mobile-nav-${item.id}`}
								className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
									active
										? "text-[#FFB6C1]"
										: isReelsPage
											? "text-gray-500 hover:text-white"
											: "text-gray-400"
								}`}
							>
								<Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
								<span
									className={`text-[10px] font-semibold ${
										active
											? "text-[#c2185b]"
											: isReelsPage
												? "text-gray-500"
												: "text-gray-400"
									}`}
								>
									{item.label}
								</span>
							</Link>
						);
					})}
					<button
						id="mobile-nav-logout"
						onClick={handleLogout}
						className={`flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-200 ${
							isReelsPage
								? "text-gray-500 hover:text-white"
								: "text-gray-400 hover:text-[#c2185b]"
						}`}
					>
						<LogoutIcon className="h-6 w-6" />
						<span className="text-[10px] font-semibold">Logout</span>
					</button>
				</nav>
			</div>
		</ProtectedRoute>
	);
}
