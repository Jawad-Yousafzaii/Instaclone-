import {cn} from "@/lib/utils/helpers";

export default function SkeletonLoader({
	type = "text",
	count = 1,
	className = "",
}) {
	const renderSkeleton = () => {
		switch (type) {
			case "text":
				return (
					<div className="space-y-3">
						{Array.from({length: count}).map((_, i) => (
							<div
								key={i}
								className={cn(
									"h-4 animate-pulse rounded-lg bg-white/10",
									i === count - 1 ? "w-3/4" : "w-full",
									className,
								)}
							/>
						))}
					</div>
				);

			case "card":
				return (
					<div className={cn("glass rounded-3xl p-6", className)}>
						<div className="mb-4 h-48 animate-pulse rounded-2xl bg-white/10" />
						<div className="mb-3 h-5 animate-pulse rounded-lg bg-white/10" />
						<div className="h-4 w-3/4 animate-pulse rounded-lg bg-white/10" />
					</div>
				);

			case "grid":
				return (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({length: count}).map((_, i) => (
							<div key={i} className="glass rounded-3xl p-6">
								<div className="mb-4 h-48 animate-pulse rounded-2xl bg-white/10" />
								<div className="mb-3 h-5 animate-pulse rounded-lg bg-white/10" />
								<div className="h-4 w-3/4 animate-pulse rounded-lg bg-white/10" />
							</div>
						))}
					</div>
				);

			case "media":
				return (
					<div className={cn("space-y-6", className)}>
						<div className="h-96 animate-pulse rounded-3xl bg-white/10" />
						<div className="h-6 w-1/2 animate-pulse rounded-lg bg-white/10" />
						<div className="h-4 animate-pulse rounded-lg bg-white/10" />
						<div className="h-4 w-3/4 animate-pulse rounded-lg bg-white/10" />
					</div>
				);

			default:
				return (
					<div
						className={cn(
							"h-4 animate-pulse rounded-lg bg-white/10",
							className,
						)}
					/>
				);
		}
	};

	return renderSkeleton();
}
