import {useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Avatar from "@/components/ui/Avatar";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {useAuthStore} from "@/store/useAuthStore";

function DashboardIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
		</svg>
	);
}

function UploadIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
		</svg>
	);
}

function ContentIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
		</svg>
	);
}

function LogoutIcon({className}) {
	return (
		<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
		</svg>
	);
}

function CloudIcon({className}) {
	return (
		<svg className={className} fill="currentColor" viewBox="0 0 24 24">
			<path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
		</svg>
	);
}

const NAV_ITEMS = [
	{label: "Overview", icon: DashboardIcon, to: ROUTES.CREATOR.DASHBOARD, id: "overview"},
	{label: "Upload", icon: UploadIcon, to: ROUTES.CREATOR.UPLOAD, id: "upload"},
];

export default function CreatorLayout({children}) {
	const navigate = useNavigate();
	const location = useLocation();
	const {user, logout} = useAuthStore();
	const [collapsed, setCollapsed] = useState(false);

	const handleLogout = () => {
		logout();
		navigate(ROUTES.AUTH.LOGIN);
	};

	const isActive = (item) => {
		return location.pathname === item.to;
	};

	return (
		<ProtectedRoute allowedRoles={[USER_ROLES.CREATOR]}>
			<div className="flex min-h-screen bg-[#fafafa]">
				<aside
					className={`fixed top-0 left-0 h-screen z-40 bg-white transition-all duration-300 ease-in-out flex flex-col shadow-[1px_0_0_0_rgba(255,182,193,0.25),4px_0_16px_-4px_rgba(255,182,193,0.08)] ${
						collapsed ? "w-[76px]" : "w-[260px]"
					}`}
				>
					<div className={`flex items-center gap-3 py-7 ${collapsed ? "justify-center px-3" : "px-6"}`}>
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#f48fb1] shadow-md shadow-[#FFB6C1]/25">
							<CloudIcon className="h-5 w-5 text-white" />
						</div>
						{!collapsed && (
							<div>
								<h1 className="text-lg font-black tracking-tight text-gray-900">LuminaCloud</h1>
								<p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#f48fb1]">Creator Studio</p>
							</div>
						)}
					</div>

					<div className={`mx-3 mb-4 h-px bg-gradient-to-r from-transparent via-[#FFB6C1]/30 to-transparent`} />

					<nav className="flex flex-col gap-1.5 px-3 flex-1">
						{NAV_ITEMS.map((item) => {
							const Icon = item.icon;
							const active = isActive(item);
							return (
								<Link
									key={item.id}
									to={item.to}
									id={`creator-nav-${item.id}`}
									className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 transition-all duration-200 ${
										collapsed ? "justify-center px-0" : ""
									} ${
										active
											? "bg-gradient-to-r from-[#FFB6C1]/15 to-[#FFB6C1]/5 text-[#c2185b]"
											: "text-gray-400 hover:bg-[#FFB6C1]/5 hover:text-gray-700"
									}`}
									title={collapsed ? item.label : ""}
								>
									{active && (
										<div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-[#FFB6C1]" />
									)}
									<Icon className={`h-[22px] w-[22px] shrink-0 transition-colors ${active ? "text-[#c2185b]" : "group-hover:text-[#FFB6C1]"}`} />
									{!collapsed && (
										<span className={`text-[13px] tracking-wide ${active ? "font-bold" : "font-semibold"}`}>
											{item.label}
										</span>
									)}
								</Link>
							);
						})}
					</nav>

					<div className={`mx-3 mb-2 h-px bg-gradient-to-r from-transparent via-[#FFB6C1]/20 to-transparent`} />

					<div className={`p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
						{!collapsed ? (
							<div className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#FFB6C1]/5">
								<div className="relative">
									<Avatar src={user?.avatar} name={user?.name} size="md" />
									<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
									<p className="text-[11px] font-semibold text-[#FFB6C1] truncate">Creator</p>
								</div>
								<button
									id="creator-logout-btn"
									onClick={handleLogout}
									className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all"
									title="Logout"
								>
									<LogoutIcon className="h-4 w-4" />
								</button>
							</div>
						) : (
							<>
								<div className="relative">
									<Avatar src={user?.avatar} name={user?.name} size="sm" />
									<div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
								</div>
								<button
									id="creator-logout-icon-btn"
									onClick={handleLogout}
									className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-400 transition-all"
									title="Logout"
								>
									<LogoutIcon className="h-4 w-4" />
								</button>
							</>
						)}
					</div>

					<button
						id="creator-sidebar-toggle"
						onClick={() => setCollapsed((c) => !c)}
						className="absolute -right-3 top-[52px] flex h-6 w-6 items-center justify-center rounded-full border border-[#FFB6C1]/30 bg-white shadow-sm text-gray-400 hover:text-[#FFB6C1] hover:border-[#FFB6C1]/50 transition-all z-50"
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
					className={`flex-1 transition-all duration-300 ease-in-out ${
						collapsed ? "ml-[76px]" : "ml-[260px]"
					}`}
				>
					<div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#FFB6C1]/10 bg-white/80 backdrop-blur-md px-8 py-4">
						<div>
							<h2 className="text-lg font-bold text-gray-900">
								{NAV_ITEMS.find((i) => isActive(i))?.label || "Studio"}
							</h2>
						</div>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 rounded-full bg-[#FFB6C1]/8 px-3 py-1.5">
								<div className="h-2 w-2 rounded-full bg-[#FFB6C1] animate-pulse" />
								<span className="text-xs font-semibold text-gray-500">Live</span>
							</div>
						</div>
					</div>
					<div className="mx-auto max-w-7xl px-8 py-8">
						{children}
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
