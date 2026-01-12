import {cn, getInitials} from "@/lib/utils/helpers";

const sizes = {
	xs: "h-6 w-6 text-xs",
	sm: "h-8 w-8 text-sm",
	md: "h-10 w-10 text-base",
	lg: "h-12 w-12 text-lg",
	xl: "h-16 w-16 text-xl",
};

export default function Avatar({
	src,
	alt = "",
	name = "",
	size = "md",
	online = false,
	className = "",
}) {
	const initials = getInitials(name || alt);

	return (
		<div className={cn("relative inline-block", className)}>
			<div
				className={cn(
					"from-accent-cyan to-accent-violet flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white ring-2 ring-white/10",
					sizes[size],
				)}
			>
				{src ? (
					<img
						src={src}
						alt={alt || name}
						className="h-full w-full object-cover"
					/>
				) : (
					<span>{initials}</span>
				)}
			</div>
			{online && (
				<span className="bg-accent-green ring-bg-primary absolute right-0 bottom-0 block h-3 w-3 rounded-full ring-2" />
			)}
		</div>
	);
}
