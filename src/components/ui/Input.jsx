import {cn} from "@/lib/utils/helpers";

export default function Input({
	label,
	error,
	type = "text",
	className = "",
	containerClassName = "",
	...props
}) {
	const inputClasses = cn(
		"w-full px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 transition-all duration-300",
		"focus:outline-none focus:border-[#FFB6C1] focus:ring-4 focus:ring-[#FFB6C1]/15",
		error &&
			"border-[#f48fb1]/60 focus:border-[#f48fb1]/60 focus:ring-[#f48fb1]/10",
		"disabled:opacity-50 disabled:cursor-not-allowed",
		className,
	);

	return (
		<div className={cn("space-y-2.5", containerClassName)}>
			{label && (
				<label className="text-text-secondary ml-1 block text-sm font-black tracking-tight">
					{label}
				</label>
			)}
			{type === "textarea" ? (
				<textarea
					className={cn(inputClasses, "min-h-[140px] resize-none")}
					{...props}
				/>
			) : (
				<input type={type} className={inputClasses} {...props} />
			)}
			{error && (
				<p className="text-accent-magenta ml-1 flex items-center gap-1.5 text-xs font-bold">
					<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					{error}
				</p>
			)}
		</div>
	);
}
