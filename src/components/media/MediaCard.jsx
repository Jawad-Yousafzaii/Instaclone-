import {useState, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import {ROUTES} from "@/lib/constants/constants";
import {formatRelativeTime} from "@/lib/utils/helpers";
import {commentService} from "@/services/commentService";
import {useAuthStore} from "@/store/useAuthStore";
import CommentSection from "@/components/media/CommentSection";
import RatingComponent from "@/components/media/RatingComponent";

export default function MediaCard({media, showCreator = false, comments = [], userRating = 0, onRatingChange, videoRef, autoPlayVideo = false}) {
	const navigate = useNavigate();
	const {user} = useAuthStore();
	const detailPath = ROUTES.CONSUMER.MEDIA_DETAIL.replace(":id", media.id);

	const [heartVisible, setHeartVisible] = useState(false);
	const [heartButtonPulse, setHeartButtonPulse] = useState(false);
	const [currentRating, setCurrentRating] = useState(userRating);
	const [avgRating, setAvgRating] = useState(media.averageRating || 0);
	const [cardComments, setCardComments] = useState(comments);
	const [showComments, setShowComments] = useState(false);
	const lastTapRef = useRef(0);

	const triggerLike = useCallback(async () => {
		setHeartVisible(true);
		setTimeout(() => setHeartVisible(false), 800);
		setHeartButtonPulse(true);
		setTimeout(() => setHeartButtonPulse(false), 300);

		if (user && currentRating < 5) {
			const newRating = 5;
			try {
				const result = await commentService.addRating(media.id, newRating, user.id);
				setCurrentRating(newRating);
				setAvgRating(result.averageRating);
				if (onRatingChange) onRatingChange(newRating, result);
			} catch {}
		}
	}, [user, currentRating, media.id, onRatingChange]);

	const handleDoubleTap = useCallback(
		(e) => {
			e.preventDefault();
			const now = Date.now();
			const DOUBLE_TAP_DELAY = 350;

			if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
				triggerLike();
			}
			lastTapRef.current = now;
		},
		[triggerLike],
	);

	const handleRatingChange = async (rating) => {
		if (!user) return;
		try {
			const result = await commentService.addRating(media.id, rating, user.id);
			setCurrentRating(rating);
			setAvgRating(result.averageRating);
			if (onRatingChange) onRatingChange(rating, result);
		} catch {}
	};

	const handleMediaClick = (e) => {
		if (media.type === "video" && autoPlayVideo) {
			navigate(ROUTES.CONSUMER.REELS);
		} else {
			handleDoubleTap(e);
		}
	};

	return (
		<article className="mx-auto w-full max-w-[468px] border-b border-gray-100 pb-6 mb-2">
			{showCreator && (
				<div
					className="flex items-center gap-3 px-1 py-3 cursor-pointer"
					onClick={() => navigate(detailPath)}
				>
					<div className="relative">
						<div className="rounded-full p-[2px] bg-gradient-to-tr from-[#FFB6C1] to-[#f48fb1]">
							<div className="rounded-full p-[2px] bg-white">
								<Avatar src={media.creatorAvatar} name={media.creatorName} size="md" />
							</div>
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold text-gray-900 truncate">{media.creatorName}</p>
						{media.location && (
							<p className="text-xs text-gray-400 truncate">{media.location}</p>
						)}
					</div>
					<span className="text-xs text-gray-400 shrink-0">{formatRelativeTime(media.createdAt)}</span>
				</div>
			)}

			<div
				className="relative w-full overflow-hidden bg-gray-50 select-none rounded-sm cursor-pointer"
				onClick={handleMediaClick}
			>
				{media.type === "video" ? (
					<video
						ref={videoRef}
						src={media.url}
						className="h-full w-full max-h-[650px] object-contain bg-black"
						muted
						playsInline
						loop
						autoPlay={autoPlayVideo}
						preload={autoPlayVideo ? "auto" : "metadata"}
						poster={media.thumbnail}
					/>
				) : (
					<img
						src={media.thumbnail || media.url}
						alt={media.title}
						className="h-auto w-full max-h-[650px] object-contain bg-black"
						draggable={false}
					/>
				)}

				{media.type === "video" && !autoPlayVideo && (
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
							<svg className="ml-1 h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					</div>
				)}

				{media.type === "image" && media.averageRating > 0 && (
					<div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 backdrop-blur-sm shadow-sm">
						<svg className="h-3 w-3 text-[#FFB6C1]" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span className="text-xs font-bold text-gray-800">{avgRating.toFixed(1)}</span>
					</div>
				)}

				<div
					className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
						heartVisible ? "heart-burst" : "opacity-0"
					}`}
				>
					<svg
						className="h-28 w-28 drop-shadow-2xl"
						fill="#FFB6C1"
						viewBox="0 0 24 24"
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				</div>
			</div>

			<div className="px-1 pt-3 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<button
							id={`like-btn-${media.id}`}
							onClick={async (e) => {
								e.stopPropagation();
								triggerLike();
							}}
							className={`p-1 transition-transform active:scale-90 ${heartButtonPulse ? "heart-btn-pulse" : ""}`}
						>
							<svg
								className="h-7 w-7 transition-colors"
								fill={currentRating >= 5 ? "#FFB6C1" : "none"}
								stroke={currentRating >= 5 ? "#FFB6C1" : "#262626"}
								strokeWidth={1.75}
								viewBox="0 0 24 24"
							>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
						</button>
						<button
							id={`comment-btn-${media.id}`}
							onClick={() => setShowComments((v) => !v)}
							className="p-1"
						>
							<svg className="h-7 w-7" fill="none" stroke="#262626" strokeWidth={1.75} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</button>
					</div>
					<RatingComponent
						value={currentRating}
						onChange={handleRatingChange}
						size="sm"
						showCount={avgRating > 0}
						count={media.ratingsCount || 0}
					/>
				</div>

				{avgRating > 0 && (
					<p className="text-sm font-semibold text-gray-900">
						{avgRating.toFixed(1)} avg · {media.ratingsCount || 0} ratings
					</p>
				)}

				<div>
					<p className="text-sm text-gray-900">
						<span className="font-semibold mr-1">{media.creatorName}</span>
						<span className="text-gray-800">{media.title}</span>
					</p>
					{media.caption && (
						<p className="text-sm text-gray-600 line-clamp-2 mt-1">{media.caption}</p>
					)}
				</div>

				{media.commentsCount > 0 && !showComments && (
					<button
						onClick={() => setShowComments(true)}
						className="text-sm text-gray-400"
					>
						View all {media.commentsCount} comments
					</button>
				)}

				{showComments && (
					<div className="pt-2 border-t border-gray-50">
						<CommentSection mediaId={media.id} comments={cardComments} />
					</div>
				)}
			</div>
		</article>
	);
}
