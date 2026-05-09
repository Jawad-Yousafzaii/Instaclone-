import {useState, useEffect, useRef} from "react";
import MediaCard from "@/components/media/MediaCard";
import {mediaService} from "@/services/mediaService";
import {useMediaStore} from "@/store/useMediaStore";
import {useAuthStore} from "@/store/useAuthStore";

export default function Feed() {
	const {filters, setFilters} = useMediaStore();
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(filters.search || "");

	useEffect(() => {
		loadMedia();
	}, [filters.search, filters.sortBy]);

	const loadMedia = async () => {
		setLoading(true);
		try {
			const data = await mediaService.getAllMedia({...filters});
			setMedia(data);
		} catch {
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters({search: searchQuery});
	};

	return (
		<div className="flex flex-col items-center w-full min-h-screen">
			<div className="w-full max-w-[468px]">
				<form onSubmit={handleSearch} className="mb-6">
					<div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
						<svg
							className="h-5 w-5 text-gray-400 shrink-0"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
						<input
							id="feed-search-input"
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search..."
							className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setFilters({search: ""});
								}}
								className="text-gray-400 hover:text-gray-600"
							>
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						)}
					</div>
				</form>

				<div className="flex gap-4 mb-6 overflow-x-auto pb-1 scrollbar-hide">
					{["newest", "popular", "highest-rated"].map((sort) => (
						<button
							key={sort}
							id={`sort-${sort}`}
							onClick={() => setFilters({sortBy: sort})}
							className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
								filters.sortBy === sort
									? "bg-[#FFB6C1] text-white"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							{sort === "newest" ? "Newest" : sort === "popular" ? "Popular" : "Top Rated"}
						</button>
					))}
				</div>

				{loading ? (
					<div className="space-y-6">
						{Array.from({length: 3}).map((_, i) => (
							<div key={i} className="space-y-3">
								<div className="flex items-center gap-3 px-1">
									<div className="h-10 w-10 animate-pulse rounded-full bg-gray-100" />
									<div className="space-y-1.5 flex-1">
										<div className="h-3 w-28 animate-pulse rounded-full bg-gray-100" />
										<div className="h-3 w-20 animate-pulse rounded-full bg-gray-100" />
									</div>
								</div>
								<div className="aspect-square w-full animate-pulse rounded-none bg-gray-100" />
								<div className="space-y-2 px-1">
									<div className="h-3 w-1/2 animate-pulse rounded-full bg-gray-100" />
									<div className="h-3 w-3/4 animate-pulse rounded-full bg-gray-100" />
								</div>
							</div>
						))}
					</div>
				) : media.length === 0 ? (
					<div className="flex flex-col items-center gap-4 py-20">
						<div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-900">
							<svg className="h-8 w-8 text-gray-900" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<p className="text-xl font-bold text-gray-900">No posts yet</p>
						<p className="text-sm text-gray-500">When posts are shared, you'll see them here.</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-0">
						{media.map((item) => (
							<FeedItem key={item.id} media={item} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function FeedItem({media}) {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	const [isVisible, setIsVisible] = useState(false);
	const {user} = useAuthStore();
	const userRating = media.ratings?.find(r => r.userId === user?.id)?.rating || 0;

	useEffect(() => {
		if (media.type !== "video") return;
		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{threshold: 0.5},
		);
		if (containerRef.current) observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, [media.type]);

	useEffect(() => {
		if (media.type !== "video" || !videoRef.current) return;
		if (isVisible) {
			videoRef.current.play().catch(() => {});
		} else {
			videoRef.current.pause();
		}
	}, [isVisible, media.type]);

	if (media.type === "video") {
		return (
			<article ref={containerRef} className="mx-auto w-full max-w-[468px] border-b border-gray-100 pb-6 mb-2">
				<MediaCard media={media} showCreator videoRef={videoRef} autoPlayVideo userRating={userRating} />
			</article>
		);
	}

	return <MediaCard media={media} showCreator userRating={userRating} />;
}
