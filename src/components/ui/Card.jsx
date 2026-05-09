import {cn} from "@/lib/utils/helpers";

export default function Card({
	children,
	className = "",
	hover = true,
	variant = "default",
}) {
	const variants = {
		default: "glass",
		strong: "glass-strong",
		subtle: "glass-subtle",
	};

	return (
		<div
			className={cn(
				"rounded-3xl transition-all duration-300",
				variants[variant],
				hover &&
					"hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,182,193,0.18)]",
				className,
			)}
		>
			{children}
		</div>
	);
}

Card.Header = function CardHeader({children, className = ""}) {
	return (
		<div className={cn("border-b border-white/10 px-6 py-4", className)}>
			{children}
		</div>
	);
};

Card.Body = function CardBody({children, className = ""}) {
	return <div className={cn("p-6", className)}>{children}</div>;
};

Card.Footer = function CardFooter({children, className = ""}) {
	return (
		<div className={cn("border-t border-white/10 px-6 py-4", className)}>
			{children}
		</div>
	);
};
