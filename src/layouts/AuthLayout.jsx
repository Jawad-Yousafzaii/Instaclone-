export default function AuthLayout({children}) {
	return (
		<div className="bg-gradient-mesh relative flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
			{/* Left Side: Immersive Branding (60%) */}
			<div className="relative hidden flex-[1.4] items-center justify-center overflow-hidden border-r border-white/10 bg-white/5 lg:flex">
				{/* Background Atmosphere */}
				<div className="bg-gradient-mesh absolute inset-0 opacity-40" />
				<div className="orb orb-pink -top-40 -left-40 h-[600px] w-[600px] opacity-10" />
				<div className="orb orb-magenta -right-20 bottom-20 h-96 w-96 opacity-15" />

				{/* Stylized Branding */}
				<div className="relative z-10 text-center">
					<div className="mb-6 inline-block">
						<div className="from-accent-pink to-accent-magenta shadow-glow-pink flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br">
							<svg
								className="h-10 w-10 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={2.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
								/>
							</svg>
						</div>
					</div>
					<h1 className="text-text-primary mb-2 text-8xl leading-none font-black tracking-tighter md:text-[10rem]">
						VELORA
					</h1>
					<div className="flex items-center justify-center gap-6">
						<div className="bg-accent-pink h-px w-16" />
						<span className="text-accent-pink text-xl font-black tracking-[0.5em] uppercase">
							Studio
						</span>
						<div className="bg-accent-pink h-px w-16" />
					</div>
					<p className="text-text-tertiary mt-12 max-w-sm text-xl font-bold tracking-tight text-balance">
						The next generation of creative media management.
					</p>
				</div>

				{/* Floating Decorative Elements */}
				<div className="glass-strong shadow-glass-lg absolute top-[15%] left-[10%] h-40 w-40 rotate-12 rounded-[2.5rem] border-white/40 opacity-50 backdrop-blur-3xl" />
				<div className="glass shadow-glass-lg absolute right-[10%] bottom-[15%] h-28 w-28 -rotate-12 rounded-[2rem] border-white/20 opacity-40 backdrop-blur-2xl" />
			</div>

			{/* Right Side: Form Content (40%) */}
			<div className="relative z-20 flex min-h-screen flex-1 flex-col items-center justify-center p-8 lg:p-16">
				{/* Mobile Branding (Visible only on mobile/tablet) */}
				<div className="mb-12 flex flex-col items-center lg:hidden">
					<div className="from-accent-pink to-accent-magenta shadow-glow-pink mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
						<svg
							className="h-8 w-8 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
							/>
						</svg>
					</div>
					<h1 className="text-text-primary text-5xl font-black tracking-tighter">
						AURA
					</h1>
					<span className="text-accent-pink text-[10px] font-black tracking-[0.5em] uppercase">
						Studio
					</span>
				</div>

				<div className="w-full max-w-md">{children}</div>

				{/* Integrated Footer */}
				<div className="mt-16 flex flex-col items-center gap-6">
					<div className="bg-accent-grey/50 h-px w-10" />
					<p className="text-text-muted text-[10px] font-black tracking-[0.4em] uppercase">
						© 2026 VELORA STUDIOS
					</p>
				</div>
			</div>
		</div>
	);
}
