import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import CommentSection from "@/components/media/CommentSection";
import RatingComponent from "@/components/media/RatingComponent";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {formatDate} from "@/lib/utils/helpers";
import {commentService} from "@/services/commentService";
import {mediaService} from "@/services/mediaService";
import {useAuthStore} from "@/store/useAuthStore";

export default function MediaDetail() {
	const {id} = useParams();
	const {user} = useAuthStore();
	const [media, setMedia] = useState(null);
	const [loading, setLoading] = useState(true);
	const [userRating, setUserRating] = useState(0);
	const [showFullCaption, setShowFullCaption] = useState(false);

	useEffect(() => {
		loadMedia();
	}, [id]);

	const loadMedia = async () => {
		try {
			const data = await mediaService.getMediaById(id);
			setMedia(data);

			const existingRating = data.ratings?.find((r) => r.userId === user?.id);
			if (existingRating) {
				setUserRating(existingRating.rating);
			}
		} catch (error) {
			console.error("Failed to load media:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRating = async (rating) => {
		try {
			const result = await commentService.addRating(id, rating, user.id);
			setUserRating(rating);
			setMedia({
				...media,
				averageRating: result.averageRating,
				totalRatings: result.totalRatings,
			});
		} catch (error) {
			console.error("Failed to add rating:", error);
		}
	};

	if (loading) {
		return <SkeletonLoader type="media" />;
	}

	if (!media) {
		return (
			<div className="glass rounded-3xl p-12 text-center">
				<h2 className="mb-2 text-2xl font-bold text-white">Media not found</h2>
				<p className="text-white/60">
					The media you're looking for doesn't exist.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Unique Floating Back Button */}
			<button
				onClick={() => window.history.back()}
				className="glass-strong shadow-glass-lg hover:shadow-glow-pink group fixed top-8 left-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border-white/40 transition-all duration-500 hover:scale-110"
				title="Back to Feed"
			>
				<div className="bg-accent-pink/5 absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100" />
				<svg
					className="text-text-primary h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={3}
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>

			<div className="mx-auto max-w-6xl">
				<div className="shadow-glass-lg overflow-hidden rounded-[2.5rem] border border-white/40 bg-black">
					{media.type === "video" ? (
						<video
							src={media.url}
							controls
							autoPlay
							muted
							className="aspect-video w-full object-contain"
							poster={media.thumbnail}
						>
							Your browser does not support the video tag.
						</video>
					) : (
						<img
							src={media.url}
							alt={media.title}
							className="aspect-video w-full object-contain"
						/>
					)}
				</div>

				{/* Content Below */}
				<div className="mt-10 space-y-6">
					{/* Combined Info Card - Unified Flex Layout */}
					<div className="glass-strong rounded-[2.5rem] border-white/40 p-10 shadow-sm">
						<div className="space-y-8">
							{/* Header: Title */}
							<div className="flex items-center justify-between gap-4">
								<h1 className="text-text-primary text-3xl font-black tracking-tighter md:text-5xl">
									{media.title}
								</h1>
								<div className="gradient-accent shadow-glow-pink rounded-xl px-4 py-1.5 text-[10px] font-black tracking-widest text-white uppercase">
									{media.type}
								</div>
							</div>

							<div className="bg-accent-grey/40 h-px w-full" />

							{/* Meta Row: Location & Creator */}
							<div className="flex flex-wrap items-center gap-6">
								{/* Location */}
								<div className="text-text-secondary flex items-center gap-2.5">
									<div className="bg-accent-pink/10 text-accent-pink flex h-9 w-9 items-center justify-center rounded-full">
										<svg
											className="h-5 w-5"
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
									</div>
									<span className="text-base font-bold tracking-tight">
										{media.location}
									</span>
								</div>

								{/* Creator Badge */}
								<div className="bg-accent-grey/50 hover:border-accent-pink/20 flex cursor-pointer items-center gap-2 rounded-2xl border border-transparent px-4 py-2 transition-all hover:bg-white">
									<Avatar
										src={media.creatorAvatar}
										name={media.creatorName}
										size="xs"
										className="border-2 border-white shadow-sm"
									/>
									<span className="text-text-tertiary text-xs font-black tracking-tight">
										@{media.creatorName.toLowerCase().replace(/\s+/g, "")}
									</span>
								</div>

								{/* Views & Date (Subtle) */}
								<div className="text-text-muted ml-auto flex items-center gap-4 text-[10px] font-black tracking-widest uppercase">
									<span>{media.views.toLocaleString()} VIEWED</span>
									<div className="bg-accent-pink h-1 w-1 rounded-full" />
									<span>{formatDate(media.createdAt).toUpperCase()}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Layout in 2 columns for wider screens */}
					<div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
						{/* Left: Description */}
						<div className="glass flex flex-col justify-center rounded-[2.5rem] p-10 shadow-sm">
							<p
								className={`text-text-primary text-xl leading-relaxed font-bold tracking-tight ${!showFullCaption && "line-clamp-6"}`}
							>
								{media.caption}
							</p>
							{media.caption.length > 300 && (
								<button
									onClick={() => setShowFullCaption(!showFullCaption)}
									className="text-accent-pink mt-6 self-start text-xs font-black tracking-widest uppercase hover:underline"
								>
									{showFullCaption ? "Collapse view" : "Expand story"}
								</button>
							)}
						</div>

						{/* Right: Rating */}
						<div className="glass flex flex-col justify-center rounded-[2.5rem] p-10 shadow-sm">
							<h3 className="text-text-primary mb-2 text-2xl font-black tracking-tighter">
								Rate this work
							</h3>
							<p className="text-text-tertiary mb-8 text-sm font-bold">
								{userRating > 0
									? `Your verdict: ${userRating}/5 stars`
									: "Submit your impressions"}
							</p>
							<div className="bg-accent-grey/20 border-accent-grey/30 flex justify-center rounded-3xl border py-10">
								<RatingComponent
									value={userRating}
									onChange={handleRating}
									size="lg"
								/>
							</div>
						</div>
					</div>

					{/* Comments Section - Focus View */}
					<div className="glass-strong rounded-[2.5rem] border-white/40 p-10 shadow-lg">
						<CommentSection mediaId={media.id} comments={media.comments} />
					</div>
				</div>
			</div>
		</div>
	);
}
