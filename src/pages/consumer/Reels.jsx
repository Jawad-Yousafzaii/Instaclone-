import {useState, useEffect, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import Avatar from "@/components/ui/Avatar";
import {ROUTES} from "@/lib/constants/constants";
import {mediaService} from "@/services/mediaService";
import {commentService} from "@/services/commentService";
import {useAuthStore} from "@/store/useAuthStore";

function ReelItem({media, isActive}) {
	const navigate = useNavigate();
	const {user} = useAuthStore();
	const videoRef = useRef(null);
	const lastTapRef = useRef(0);
	const viewedRef = useRef(false);

	const userRating = media.ratings?.find(r => r.userId === user?.id)?.rating || 0;
	const [liked, setLiked] = useState(userRating >= 5);
	const [heartVisible, setHeartVisible] = useState(false);
	const [heartButtonPulse, setHeartButtonPulse] = useState(false);
	const [muted, setMuted] = useState(true);
	const [playing, setPlaying] = useState(false);
	const [avgRating, setAvgRating] = useState(media.averageRating || 0);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		if (isActive) {``
			video.play().then(() => {
				setPlaying(true);
				if (!viewedRef.current) {
					mediaService.incrementViews(media.id).catch(() => {});
					viewedRef.current = true;
				}
			}).catch(() => {});
		} else {
			video.pause();
			video.currentTime = 0;
			setPlaying(false);
		}
	}, [isActive]);

	const triggerLike = useCallback(async () => {
		setHeartVisible(true);
		setTimeout(() => setHeartVisible(false), 800);
		setLiked(true);
		setHeartButtonPulse(true);
		setTimeout(() => setHeartButtonPulse(false), 300);

		if (user && !liked) {
			try {
				const result = await commentService.addRating(media.id, 5, user.id);
				setAvgRating(result.averageRating);
			} catch {}
		}
	}, [user, media.id, liked]);

	const handleDoubleTap = useCallback(
		(e) => {
			e.preventDefault();
			const now = Date.now();
			if (now - lastTapRef.current < 350) {
				triggerLike();
			}
			lastTapRef.current = now;
		},
		[triggerLike],
	);

	const togglePlay = () => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) {
			video.play();
			setPlaying(true);
		} else {
			video.pause();
			setPlaying(false);
		}
	};

	return (
		<div className="relative h-[100dvh] w-full flex items-center justify-center bg-black reels-snap-item flex-shrink-0 overflow-hidden">
			<div className="relative w-full max-w-[400px] aspect-[9/16] h-full max-h-[100dvh] bg-black mx-auto">
				<video
					ref={videoRef}
					src={media.url}
					className="absolute inset-0 h-full w-full object-contain rounded-none sm:rounded-xl bg-black"
					loop
					muted={muted}
					playsInline
					poster={media.thumbnail}
					preload={isActive ? "auto" : "metadata"}
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none sm:rounded-xl" />

				<div
					className="absolute inset-0"
					onClick={handleDoubleTap}
					onDoubleClick={(e) => e.preventDefault()}
				/>

				<div
					className={`absolute inset-0 flex items-center justify-center pointer-events-none ${
						heartVisible ? "heart-burst" : "opacity-0"
					}`}
				>
					<svg
						className="h-32 w-32 drop-shadow-2xl"
						fill="#FFB6C1"
						viewBox="0 0 24 24"
					>
						<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
					</svg>
				</div>

				<button
					id={`reel-play-${media.id}`}
					onClick={(e) => { e.stopPropagation(); togglePlay(); }}
					className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
				>
					{!playing && (
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
							<svg className="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
						</div>
					)}
				</button>

				<div className="absolute right-3 bottom-28 flex flex-col items-center gap-6 z-10">
					<button
						id={`reel-like-${media.id}`}
						onClick={(e) => { e.stopPropagation(); triggerLike(); }}
						className={`flex flex-col items-center gap-1 ${heartButtonPulse ? "heart-btn-pulse" : ""}`}
					>
						<div className="flex items-center justify-center">
							<svg
								className="h-8 w-8 transition-colors drop-shadow-md"
								fill={liked ? "#FFB6C1" : "none"}
								stroke={liked ? "#FFB6C1" : "white"}
								strokeWidth={1.5}
								viewBox="0 0 24 24"
							>
								<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
							</svg>
						</div>
						<span className="text-xs font-semibold text-white drop-shadow-md">{avgRating > 0 ? avgRating.toFixed(1) : "Like"}</span>
					</button>

					<button
						id={`reel-comment-${media.id}`}
						onClick={(e) => { e.stopPropagation(); navigate(ROUTES.CONSUMER.MEDIA_DETAIL.replace(":id", media.id)); }}
						className="flex flex-col items-center gap-1"
					>
						<div className="flex items-center justify-center">
							<svg className="h-8 w-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
							</svg>
						</div>
						<span className="text-xs font-semibold text-white drop-shadow-md">{media.commentsCount || 0}</span>
					</button>

					<button
						id={`reel-mute-${media.id}`}
						onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
						className="flex items-center justify-center"
					>
						{muted ? (
							<svg className="h-8 w-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
							</svg>
						) : (
							<svg className="h-8 w-8 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0-12c-1.105 0-2.105.448-2.828 1.172M12 18c-1.105 0-2.105-.448-2.828-1.172M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
							</svg>
						)}
					</button>
				</div>

				<div className="absolute bottom-6 left-4 right-16 space-y-3 z-10 pb-4">
					<div className="flex items-center gap-3">
						<div className="rounded-full p-[2px] bg-gradient-to-tr from-[#FFB6C1] to-[#f48fb1]">
							<div className="rounded-full p-[1px] bg-black/40">
								<Avatar src={media.creatorAvatar} name={media.creatorName} size="sm" />
							</div>
						</div>
						<span className="text-sm font-semibold text-white drop-shadow-md">{media.creatorName}</span>
						<button className="text-xs text-white font-medium px-3 py-1 rounded-full border border-white/40 backdrop-blur-sm hover:bg-white/10 transition-colors">Follow</button>
					</div>
					<p className="text-sm text-white drop-shadow-md line-clamp-2 leading-snug font-medium pr-4">{media.caption || media.title}</p>
					{media.location && (
						<div className="flex items-center gap-1">
							<svg className="h-3 w-3 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span className="text-xs text-white/70 font-medium">{media.location}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function Reels() {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeIndex, setActiveIndex] = useState(0);
	const containerRef = useRef(null);

	useEffect(() => {
		(async () => {
			try {
				const data = await mediaService.getAllMedia({type: "video", sortBy: "newest"});
				setVideos(data);
			} catch {
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const index = Number(entry.target.dataset.index);
						setActiveIndex(index);
					}
				});
			},
			{root: container, threshold: 0.6},
		);

		const slides = container.querySelectorAll("[data-index]");
		slides.forEach((slide) => observer.observe(slide));

		return () => observer.disconnect();
	}, [videos]);

	if (loading) {
		return (
			<div className="absolute inset-0 bg-black flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFB6C1]/30 border-t-[#FFB6C1]" />
					<p className="text-sm text-white/60">Loading reels...</p>
				</div>
			</div>
		);
	}

	if (videos.length === 0) {
		return (
			<div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-4">
				<svg className="h-16 w-16 text-white/40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
				<p className="text-lg font-semibold text-white">No reels yet</p>
				<p className="text-sm text-white/50">Video content will appear here.</p>
			</div>
		);
	}

	return (
		<div className="absolute inset-0 bg-black">
			<div
				ref={containerRef}
				className="h-full w-full reels-snap-container"
				id="reels-container"
			>
				{videos.map((video, index) => (
					<div key={video.id} data-index={index} className="h-[100dvh] w-full flex items-center justify-center bg-black">
						<ReelItem media={video} isActive={index === activeIndex} />
					</div>
				))}
			</div>
		</div>
	);
}
