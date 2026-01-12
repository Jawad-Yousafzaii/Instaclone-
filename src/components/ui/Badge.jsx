import {cn} from "@/lib/utils/helpers";

const variants = {
	default: "bg-accent-grey text-text-secondary border-accent-grey/50",
	success: "bg-accent-green/10 text-accent-green border-accent-green/20",
	warning: "bg-accent-orange/10 text-accent-orange border-accent-orange/20",
	error: "bg-accent-magenta/10 text-accent-magenta border-accent-magenta/20",
	info: "bg-accent-pink/10 text-accent-pink border-accent-pink/20",
	violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/20",
};

const sizes = {
	sm: "px-2.5 py-0.5 text-xs",
	md: "px-3 py-1 text-sm",
	lg: "px-4 py-1.5 text-base",
};

export default function Badge({
	children,
	variant = "default",
	size = "md",
	className = "",
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border font-medium backdrop-blur-sm",
				variants[variant],
				sizes[size],
				className,
			)}
		>
			{children}
		</span>
	);
}
