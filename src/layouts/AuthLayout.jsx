export default function AuthLayout({children}) {
	return (
		<div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
			<div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
				<div className="mb-6 flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#f48fb1] shadow-md">
						<svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
						</svg>
					</div>
					<h1 className="text-3xl font-black tracking-tight text-gray-900">LuminaCloud</h1>
				</div>
			</div>

			<div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
				<div className="bg-white py-8 px-4 shadow-sm sm:rounded-none sm:px-10 border border-[#FFB6C1]/30">
					{children}
				</div>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px] text-center">
				<p className="text-xs font-bold uppercase tracking-widest text-gray-400">
					© 2026 LUMINACLOUD
				</p>
			</div>
		</div>
	);
}
