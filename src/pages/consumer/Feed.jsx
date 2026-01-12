import {useState, useEffect} from "react";
import MediaCard from "@/components/media/MediaCard";
import EmptyState from "@/components/ui/EmptyState";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {mediaService} from "@/services/mediaService";
import {useMediaStore} from "@/store/useMediaStore";

const sortOptions = [
	{value: "newest", label: "Newest"},
	{value: "popular", label: "Popular"},
	{value: "highest-rated", label: "Top Rated"},
];

export default function Feed() {
	const {filters, setFilters, resetFilters} = useMediaStore();
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(filters.search || "");

	useEffect(() => {
		loadMedia();
	}, [filters.search, filters.location, filters.sortBy, filters.dateRange]);

	const loadMedia = async () => {
		setLoading(true);
		try {
			const data = await mediaService.getAllMedia(filters);
			setMedia(data);
		} catch (error) {
			console.error("Failed to load media:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters({search: searchQuery});
	};

	return (
		<div className="space-y-10">
			
			{/* Search Bar Section */}
			<form onSubmit={handleSearch} className="mx-auto max-w-3xl">
				<div className="glass-strong flex items-center gap-3 rounded-[2.5rem] p-3 shadow-lg">
					<div className="relative flex-1">
						<svg
							className="text-text-muted absolute top-1/2 left-6 h-5 w-5 -translate-y-1/2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search photos, locations..."
							className="text-text-primary placeholder:text-text-muted w-full bg-transparent py-5 pr-4 pl-16 font-medium focus:outline-none"
						/>
					</div>
					<button
						type="submit"
						className="gradient-accent hover:shadow-glow-pink rounded-[2rem] px-10 py-5 font-bold text-white transition-all hover:scale-[1.02]"
					>
						Search
					</button>
				</div>
			</form>


			{!loading && media.length > 0 && (
				<p className="text-text-tertiary text-center text-sm font-bold">
					{media.length} items found
				</p>
			)}

			{/* Media Grid */}
			{loading ? (
				<SkeletonLoader type="grid" count={6} />
			) : media.length === 0 ? (
				<EmptyState
					icon={
						<svg
							className="h-16 w-16"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					}
					title="No content found"
					description="Try adjusting your search or filters to discover more"
				/>
			) : (
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{media.map((item) => (
						<MediaCard key={item.id} media={item} showCreator />
					))}
				</div>
			)}
		</div>
	);
}
