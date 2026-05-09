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
					"flex items-center justify-center overflow-hidden rounded-full font-semibold text-white ring-2 ring-[#FFB6C1]/20",
					"bg-gradient-to-br from-[#FFB6C1] to-[#f48fb1]",
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
				<span className="absolute right-0 bottom-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
			)}
		</div>
	);
}
