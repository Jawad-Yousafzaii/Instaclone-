import {Link} from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import {ROUTES} from "@/lib/constants/constants";
import {formatRelativeTime} from "@/lib/utils/helpers";

export default function MediaCard({media, showCreator = false}) {
	const detailPath = ROUTES.CONSUMER.MEDIA_DETAIL.replace(":id", media.id);

	return (
		<Link to={detailPath}>
			<div className="group glass hover:shadow-glass-lg overflow-hidden rounded-[2rem] transition-all duration-300 hover:-translate-y-2">
				{/* Image */}
				<div className="relative aspect-video overflow-hidden">
					{media.type === "video" ? (
						<video
							src={media.url}
							className="h-full w-full object-cover"
							muted
							playsInline
							preload="metadata"
						/>
					) : (
						<img
							src={media.thumbnail}
							alt={media.title}
							className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
					)}

					{/* Gradient Overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

					{/* Video Play Icon */}
					{media.type === "video" && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-transform group-hover:scale-110">
								<svg
									className="ml-0.5 h-6 w-6 text-white"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M8 5v14l11-7z" />
								</svg>
							</div>
						</div>
					)}

					{/* Type Badge */}
					<div className="absolute top-3 right-3">
						<div className="gradient-accent shadow-glow-pink rounded-lg px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase">
							{media.type}
						</div>
					</div>

					{/* Rating */}
					{media.averageRating > 0 && (
						<div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 shadow-sm backdrop-blur-sm">
							<span className="text-accent-pink">
								<svg
									className="h-3.5 w-3.5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</span>
							<span className="text-text-primary text-xs font-black">
								{media.averageRating.toFixed(1)}
							</span>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="space-y-3 p-6">
					<h3 className="group-hover:text-accent-pink text-text-primary line-clamp-1 text-lg font-black tracking-tight transition-colors">
						{media.title}
					</h3>

					<p className="text-text-tertiary line-clamp-2 text-sm leading-relaxed font-medium">
						{media.caption}
					</p>

					<div className="flex items-center justify-between pt-2">
						{showCreator ? (
							<div className="flex items-center gap-2">
								<Avatar
									src={media.creatorAvatar}
									name={media.creatorName}
									size="sm"
									className="border-2 border-white shadow-sm"
								/>
								<span className="text-text-secondary text-xs font-bold">
									{media.creatorName}
								</span>
							</div>
						) : (
							<div className="text-text-muted flex items-center gap-1.5 text-xs font-bold">
								<svg
									className="text-accent-pink h-3.5 w-3.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span className="line-clamp-1">{media.location}</span>
							</div>
						)}

						<span className="text-text-muted text-[10px] font-black tracking-widest uppercase">
							{formatRelativeTime(media.createdAt)}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
