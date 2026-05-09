import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import CommentSection from "@/components/media/CommentSection";
import RatingComponent from "@/components/media/RatingComponent";
import Avatar from "@/components/ui/Avatar";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {formatDate} from "@/lib/utils/helpers";
import {commentService} from "@/services/commentService";
import {mediaService} from "@/services/mediaService";
import {useAuthStore} from "@/store/useAuthStore";

export default function MediaDetail() {
	const {id} = useParams();
	const navigate = useNavigate();
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
			if (existingRating) setUserRating(existingRating.rating);
		} catch {
		} finally {
			setLoading(false);
		}
	};

	const handleRating = async (rating) => {
		try {
			const result = await commentService.addRating(id, rating, user.id);
			setUserRating(rating);
			setMedia({...media, averageRating: result.averageRating, totalRatings: result.totalRatings});
		} catch {}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white p-6">
				<SkeletonLoader type="media" />
			</div>
		);
	}

	if (!media) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white">
				<div className="text-center space-y-3">
					<h2 className="text-2xl font-bold text-gray-900">Media not found</h2>
					<p className="text-gray-400">The media you're looking for doesn't exist.</p>
					<button
						onClick={() => navigate(-1)}
						className="mt-4 rounded-2xl bg-[#FFB6C1] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#f48fb1] transition-colors"
					>
						Go back
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<button
				onClick={() => navigate(-1)}
				className="fixed top-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-600 hover:text-[#FFB6C1] transition-colors"
				title="Back"
			>
				<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<div className="mx-auto max-w-2xl px-4 pt-16 pb-12">
				<div className="flex items-center gap-3 mb-4">
					<div className="rounded-full p-[2px] bg-gradient-to-tr from-[#FFB6C1] to-[#f48fb1]">
						<div className="rounded-full p-[2px] bg-white">
							<Avatar src={media.creatorAvatar} name={media.creatorName} size="md" />
						</div>
					</div>
					<div>
						<p className="text-sm font-semibold text-gray-900">{media.creatorName}</p>
						{media.location && <p className="text-xs text-gray-400">{media.location}</p>}
					</div>
					<span className="ml-auto text-xs text-gray-400">{formatDate(media.createdAt)}</span>
				</div>

				<div className="overflow-hidden rounded-2xl bg-gray-50 mb-4" style={{aspectRatio: "1/1"}}>
					{media.type === "video" ? (
						<video
							src={media.url}
							controls
							autoPlay
							muted
							className="h-full w-full object-contain bg-black"
							poster={media.thumbnail}
						/>
					) : (
						<img
							src={media.url}
							alt={media.title}
							className="h-full w-full object-contain"
						/>
					)}
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1">
							<span className="inline-flex items-center rounded-full bg-[#FFB6C1]/15 px-3 py-1 text-xs font-semibold text-[#c2185b] uppercase tracking-wider">
								{media.type}
							</span>
						</div>
						{media.averageRating > 0 && (
							<div className="flex items-center gap-1.5 text-sm text-gray-600">
								<svg className="h-4 w-4 text-[#FFB6C1]" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span className="font-semibold">{media.averageRating.toFixed(1)}</span>
								<span className="text-gray-400">({media.ratingsCount || 0})</span>
							</div>
						)}
					</div>

					<h1 className="text-xl font-bold text-gray-900">{media.title}</h1>

					<div>
						<p className={`text-sm leading-relaxed text-gray-700 ${!showFullCaption && "line-clamp-3"}`}>
							{media.caption}
						</p>
						{media.caption?.length > 160 && (
							<button
								onClick={() => setShowFullCaption((v) => !v)}
								className="mt-1 text-xs font-semibold text-gray-400 hover:text-gray-600"
							>
								{showFullCaption ? "less" : "more"}
							</button>
						)}
					</div>

					{media.location && (
						<div className="flex items-center gap-2 rounded-xl bg-[#FFB6C1]/5 border border-[#FFB6C1]/15 px-4 py-3">
							<svg className="h-4 w-4 text-[#c2185b] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span className="text-sm font-medium text-gray-700">{media.location}</span>
						</div>
					)}

					{media.people && media.people.length > 0 && (
						<div className="rounded-xl bg-[#FFB6C1]/5 border border-[#FFB6C1]/15 px-4 py-3">
							<p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tagged People</p>
							<div className="flex flex-wrap gap-2">
								{media.people.map((person) => (
									<span
										key={person}
										className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-[#FFB6C1]/20"
									>
										<svg className="h-3 w-3 text-[#FFB6C1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
										{person}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="flex items-center gap-2 text-xs text-gray-400">
						<svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<span>{(media.views || 0).toLocaleString()} views</span>
					</div>

					<div className="border-t border-gray-100 pt-4">
						<p className="mb-3 text-sm font-semibold text-gray-900">Rate this</p>
						<RatingComponent
							value={userRating}
							onChange={handleRating}
							size="lg"
							showCount={media.ratingsCount > 0}
							count={media.ratingsCount}
						/>
						{userRating > 0 && (
							<p className="mt-2 text-xs text-gray-400">Your rating: {userRating}/5</p>
						)}
					</div>

					<div className="border-t border-gray-100 pt-4">
						<div className="rounded-xl bg-gradient-to-r from-[#FFB6C1]/5 to-[#f48fb1]/5 border border-[#FFB6C1]/15 px-4 py-3 mb-4">
							<div className="flex items-center gap-2 mb-2">
								<svg className="h-4 w-4 text-[#c2185b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
								<span className="text-xs font-bold text-gray-700">AI-Powered Cloud Analysis</span>
							</div>
							<p className="text-xs text-gray-500">
								Media analyzed using Azure Cognitive Services Computer Vision for automatic content description, tagging, and metadata extraction.
							</p>
						</div>
					</div>

					<div className="border-t border-gray-100 pt-4">
						<CommentSection mediaId={media.id} comments={media.comments || []} />
					</div>
				</div>
			</div>
		</div>
	);
}
