import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {authService} from "@/services/authService";
import {useAuthStore} from "@/store/useAuthStore";

export default function Home() {
	const navigate = useNavigate();
	const {login: setAuthUser} = useAuthStore();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		role: USER_ROLES.CONSUMER,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const user = await authService.login(
				formData.email,
				formData.password,
				formData.role,
			);

			setAuthUser(user);

			if (user.role === USER_ROLES.CREATOR) {
				navigate(ROUTES.CREATOR.DASHBOARD);
			} else {
				navigate(ROUTES.CONSUMER.FEED);
			}
		} catch (error) {
			setErrors({general: error.message});
		} finally {
			setIsLoading(false);
		}
	};

	const features = [
		{
			svgPath:
				"M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z",
			title: "Upload & Share",
			description: "Share your photos and videos with the world",
		},
		{
			svgPath:
				"M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
			title: "Discover",
			description: "Browse amazing content from creators worldwide",
		},
		{
			svgPath:
				"M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
			title: "Rate & Engage",
			description: "Leave ratings and comments on content you love",
		},
	];

	return (
		<div className="bg-gradient-mesh relative min-h-screen overflow-hidden">

			<div
				className="orb orb-cyan -top-32 -left-32 h-[500px] w-[500px]"
				style={{animationDelay: "0s"}}
			/>
			<div
				className="orb orb-magenta top-1/2 -right-32 h-[400px] w-[400px]"
				style={{animationDelay: "2s"}}
			/>
			<div
				className="orb orb-violet -bottom-32 left-1/4 h-[350px] w-[350px]"
				style={{animationDelay: "4s"}}
			/>


			<header className="relative z-10 px-6 py-6">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="from-accent-cyan to-accent-violet flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-[0_0_20px_rgba(0,212,255,0.3)]">
							<svg
								className="h-6 w-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
								/>
							</svg>
						</div>
						<span className="text-xl font-bold text-white">LuminaCloud</span>
					</div>
					<a
						href="#login"
						className="glass rounded-xl px-5 py-2 font-medium text-white transition-all hover:bg-white/15"
					>
						Sign In
					</a>
				</div>
			</header>


			<section className="relative z-10 px-6 py-16 md:py-24">
				<div className="mx-auto max-w-7xl">
					<div className="grid items-center gap-12 lg:grid-cols-2">

						<div className="text-center lg:text-left">
							<h1 className="mb-6 text-5xl leading-tight font-bold text-white md:text-6xl lg:text-7xl">
								Share Your
								<br />
								<span className="from-accent-cyan to-accent-violet bg-gradient-to-r bg-clip-text text-transparent">
									Moments
								</span>
							</h1>
							<p className="mx-auto mb-8 max-w-lg text-xl text-white/60 lg:mx-0">
								A beautiful platform for creators and consumers to share and
								discover amazing media content.
							</p>


							<div className="mb-8 grid gap-4 sm:grid-cols-3">
								{features.map((feature, index) => (
									<div
										key={index}
										className="glass rounded-2xl p-4 text-center transition-all hover:-translate-y-1"
									>
										<div className="text-accent-cyan mb-2 flex justify-center">
											<svg
												className="h-8 w-8"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={1.5}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d={feature.svgPath}
												/>
											</svg>
										</div>
										<h3 className="mb-1 text-sm font-semibold text-white">
											{feature.title}
										</h3>
										<p className="text-xs text-white/50">
											{feature.description}
										</p>
									</div>
								))}
							</div>

							<div className="flex flex-wrap justify-center gap-4 lg:justify-start">
								<a href="#login">
									<Button variant="primary" className="gap-2">
										Get Started
										<svg
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</Button>
								</a>
							</div>
						</div>


						<div
							id="login"
							className="glass-strong mx-auto max-w-md rounded-3xl p-8 lg:mx-0 lg:ml-auto"
						>
							<div className="mb-6 text-center">
								<h2 className="mb-1 text-2xl font-bold text-white">
									Welcome Back
								</h2>
								<p className="text-sm text-white/60">Sign in to continue</p>
							</div>


							<div className="mb-6 flex rounded-xl bg-white/5 p-1">
								<button
									type="button"
									onClick={() =>
										setFormData({...formData, role: USER_ROLES.CONSUMER})
									}
									className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
										formData.role === USER_ROLES.CONSUMER
											? "from-accent-cyan to-accent-blue bg-gradient-to-r text-white shadow-lg"
											: "text-white/60 hover:text-white"
									}`}
								>
									Consumer
								</button>
								<button
									type="button"
									onClick={() =>
										setFormData({...formData, role: USER_ROLES.CREATOR})
									}
									className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
										formData.role === USER_ROLES.CREATOR
											? "from-accent-magenta to-accent-violet bg-gradient-to-r text-white shadow-lg"
											: "text-white/60 hover:text-white"
									}`}
								>
									Creator
								</button>
							</div>

							{errors.general && (
								<div className="bg-accent-magenta/10 border-accent-magenta/20 text-accent-magenta mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.general}
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<Input
									label="Email"
									type="email"
									placeholder="you@example.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({...formData, email: e.target.value})
									}
									error={errors.email}
								/>

								<Input
									label="Password"
									type="password"
									placeholder="••••••••"
									value={formData.password}
									onChange={(e) =>
										setFormData({...formData, password: e.target.value})
									}
									error={errors.password}
								/>

								<Button type="submit" className="w-full" loading={isLoading}>
									Sign In
								</Button>
							</form>

							<p className="mt-6 text-center text-sm text-white/50">
								Don't have an account?{" "}
								<button
									onClick={() => navigate(ROUTES.AUTH.CONSUMER_SIGNUP)}
									className="text-accent-cyan hover:underline"
								>
									Create one
								</button>
							</p>
						</div>
					</div>
				</div>
			</section>


			<footer className="relative z-10 border-t border-white/5 px-6 py-8">
				<div className="mx-auto max-w-7xl text-center">
					<p className="text-sm text-white/40">
						© 2026 LUMINACLOUD. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
