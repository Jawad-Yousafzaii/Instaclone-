import {cn} from "@/lib/utils/helpers";

const variants = {
	primary:
		"gradient-accent text-white hover:shadow-glow-pink hover:scale-[1.02]",
	secondary: "glass text-text-primary hover:bg-white hover:shadow-sm",
	ghost:
		"bg-transparent text-text-tertiary hover:text-accent-pink hover:bg-accent-pink/5",
	danger:
		"bg-accent-magenta text-white hover:bg-magenta-600 hover:shadow-glow-magenta",
	outline:
		"bg-transparent border border-accent-grey text-text-secondary hover:bg-accent-grey/30 hover:border-accent-pink/30",
};

const sizes = {
	sm: "px-4 py-2 text-sm",
	md: "px-6 py-3 text-base",
	lg: "px-8 py-4 text-lg",
};

export default function Button({
	children,
	variant = "primary",
	size = "md",
	className = "",
	loading = false,
	...props
}) {
	return (
		<button
			className={cn(
				"relative flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50",
				variants[variant],
				sizes[size],
				className,
			)}
			disabled={loading || props.disabled}
			{...props}
		>
			{loading && (
				<svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			{children}
		</button>
	);
}
