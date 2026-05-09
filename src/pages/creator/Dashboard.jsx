import {useState, useEffect} from "react";
import FileUploader from "@/components/media/FileUploader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {MEDIA_TYPES} from "@/lib/constants/constants";
import {supabase} from "@/lib/supabase";
import {isImageFile, generateId, formatRelativeTime} from "@/lib/utils/helpers";
import {mediaService} from "@/services/mediaService";
import {storageService} from "@/services/storageService";
import {useAuthStore} from "@/store/useAuthStore";

function CreatorContentCard({media, onEdit, onDelete}) {
	return (
		<div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#FFB6C1]/15 transition-all hover:shadow-md hover:ring-[#FFB6C1]/40">
			<div className="aspect-[4/5] w-full overflow-hidden bg-gray-50 relative">
				{media.type === "video" ? (
					<video
						src={media.url}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						muted
						playsInline
						autoPlay
						loop
						poster={media.thumbnail}
					/>
				) : (
					<img
						src={media.thumbnail || media.url}
						alt={media.title}
						className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
						draggable={false}
					/>
				)}

				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

				<div className="absolute top-3 left-3 flex items-center gap-2">
					<span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 shadow-sm">
						<svg className="h-3 w-3 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
						</svg>
						<span className="text-[10px] font-bold text-white">{media.views || 0}</span>
					</span>
					<span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 shadow-sm">
						<svg className="h-3 w-3 text-[#FFB6C1]" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
						<span className="text-[10px] font-bold text-white">{(media.averageRating || 0).toFixed(1)}</span>
					</span>
				</div>

				<div className="absolute top-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
					<button
						onClick={() => onEdit(media)}
						className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-[#c2185b]"
						title="Edit"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
					</button>
					<button
						onClick={() => onDelete(media.id)}
						className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white shadow-sm backdrop-blur-sm transition-all hover:bg-red-500"
						title="Delete"
					>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-4">
					<h3 className="mb-1 truncate text-base font-bold text-white drop-shadow-sm">{media.title}</h3>
					<div className="flex items-center justify-between text-xs text-gray-300">
						<span>{formatRelativeTime(media.createdAt)}</span>
						{media.location && <span className="truncate max-w-[50%]">{media.location}</span>}
					</div>
				</div>
			</div>
		</div>
	);
}

export default function Dashboard() {
	const {user} = useAuthStore();
	const [media, setMedia] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [stats, setStats] = useState({
		totalMedia: 0,
		totalViews: 0,
		totalRatings: 0,
		averageRating: 0,
	});

	const [showUpload, setShowUpload] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [file, setFile] = useState(null);
	const [uploadData, setUploadData] = useState({
		title: "",
		caption: "",
		location: "",
		people: "",
	});
	const [errors, setErrors] = useState({});

	const [aiLoading, setAiLoading] = useState(false);
	const [aiError, setAiError] = useState("");

	const [allUsers, setAllUsers] = useState([]);
	const [showUserDropdown, setShowUserDropdown] = useState(false);

	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const {data} = await supabase.from("users").select("id, name");
			if (data) setAllUsers(data);
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		loadMedia();

		const channel = supabase
			.channel("dashboard_updates")
			.on("postgres_changes", {event: "*", schema: "public", table: "media"}, () => loadMedia())
			.on("postgres_changes", {event: "*", schema: "public", table: "comments"}, () => loadMedia())
			.on("postgres_changes", {event: "*", schema: "public", table: "ratings"}, () => loadMedia())
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const loadMedia = async () => {
		try {
			const data = await mediaService.getMediaByCreator(user.id);
			setMedia(data);

			const totalViews = data.reduce((sum, m) => sum + m.views, 0);
			const totalRatings = data.reduce((sum, m) => sum + m.totalRatings, 0);
			const avgRating =
				data.length > 0
					? data.reduce((sum, m) => sum + m.averageRating, 0) / data.length
					: 0;

			setStats({
				totalMedia: data.length,
				totalViews,
				totalRatings,
				averageRating: avgRating,
			});
		} catch (error) {
			console.error("Failed to load media:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this media?")) return;
		try {
			await mediaService.deleteMedia(id);
			loadMedia();
		} catch (error) {
			console.error("Failed to delete media:", error);
		}
	};

	const validateUpload = () => {
		const newErrors = {};
		if (!file && !editingId) newErrors.file = "Please select a file";
		if (!uploadData.title) newErrors.title = "Title is required";
		if (!uploadData.caption) newErrors.caption = "Caption is required";
		if (!uploadData.location) newErrors.location = "Location is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const lastSearchWord = uploadData.people.split(",").pop()?.trim() || "";
	const filteredUsers = allUsers.filter(
		(u) => u.name.toLowerCase().includes(lastSearchWord.toLowerCase()) && lastSearchWord.length > 0
	);

	const handleUserSelect = (userName) => {
		const parts = uploadData.people.split(",");
		parts.pop();
		const newPeople = parts.length > 0 ? parts.join(", ") + `, ${userName}, ` : `${userName}, `;
		setUploadData({...uploadData, people: newPeople});
		setShowUserDropdown(false);
	};

	const handleFileSelect = async (selectedFile) => {
		setFile(selectedFile);
		setAiError("");

		if (selectedFile && isImageFile(selectedFile)) {
			setAiLoading(true);
			try {
				const result = await mediaService.analyzeImageWithAI(selectedFile);
				
				const aiCaption = result.description || "";
				const aiTags = result.tags ? `\n\n#${result.tags.split(", ").join(" #")}` : "";
				const finalCaption = `${aiCaption}${aiTags}`.trim();

				setUploadData((prev) => ({
					...prev,
					caption: finalCaption || prev.caption,
				}));
			} catch (err) {
				setAiError("AI suggestion failed");
			} finally {
				setAiLoading(false);
			}
		}
	};

	const handleUploadSubmit = async (e) => {
		e.preventDefault();
		if (!validateUpload()) return;

		setIsUploading(true);
		setUploadProgress(10);

		try {
			let url = uploadData.url;
			if (file) {
				const mediaId = editingId || generateId();
				const result = await storageService.uploadFile(file, user.id, mediaId);
				url = result.url;
			}

			const people = uploadData.people
				? typeof uploadData.people === "string"
					? uploadData.people.split(",").map((p) => p.trim())
					: uploadData.people
				: [];

			const mediaData = {
				...uploadData,
				people,
				url: url || uploadData.url,
				thumbnail: url || uploadData.url,
				creatorId: user.id,
			};

			if (!editingId) {
				const mediaType = isImageFile(file)
					? MEDIA_TYPES.IMAGE
					: MEDIA_TYPES.VIDEO;
				mediaData.type = mediaType;
				await mediaService.createMedia(mediaData);
			} else {
				await mediaService.updateMedia(editingId, mediaData);
			}

			setUploadProgress(100);
			setTimeout(() => {
				setShowUpload(false);
				setEditingId(null);
				setFile(null);
				setUploadData({title: "", caption: "", location: "", people: ""});
				setIsUploading(false);
				setUploadProgress(0);
				loadMedia();
			}, 500);
		} catch (error) {
			setErrors({general: error.message});
			setIsUploading(false);
		}
	};

	const startEdit = (item) => {
		setEditingId(item.id);
		setUploadData({
			title: item.title,
			caption: item.caption,
			location: item.location || "",
			people: item.people?.join(", ") || "",
			url: item.url,
			type: item.type,
		});
		setShowUpload(true);
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	const filteredMedia = media.filter(
		(m) =>
			m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			m.location?.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const statCards = [
		{
			label: "Total Media",
			value: stats.totalMedia,
			icon: (
				<svg className="h-6 w-6 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			),
		},
		{
			label: "Total Views",
			value: stats.totalViews.toLocaleString(),
			icon: (
				<svg className="h-6 w-6 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					<path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
				</svg>
			),
		},
		{
			label: "Total Ratings",
			value: stats.totalRatings,
			icon: (
				<svg className="h-6 w-6 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
				</svg>
			),
		},
		{
			label: "Avg Rating",
			value: stats.averageRating.toFixed(1),
			icon: (
				<svg className="h-6 w-6 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
				</svg>
			),
		},
	];

	return (
		<div className="space-y-10">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
						Welcome back, {user?.name?.split(" ")[0]}
					</h1>
					<p className="text-sm font-medium text-gray-500">Manage your content and monitor your performance.</p>
				</div>
				<Button
					onClick={() => {
						if (editingId) {
							setEditingId(null);
							setShowUpload(false);
							setUploadData({title: "", caption: "", location: "", people: ""});
						} else {
							window.location.href = ROUTES.CREATOR.UPLOAD;
						}
					}}
					className="bg-gradient-to-r from-[#FFB6C1] to-[#f48fb1] hover:from-[#f48fb1] hover:to-[#ec407a] text-white font-bold px-6 py-3 rounded-xl shadow-md shadow-[#FFB6C1]/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
				>
					{editingId ? "Cancel Editing" : "+ New Post"}
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{statCards.map((stat, i) => (
					<div key={i} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15 flex items-center gap-4 hover:shadow-md transition-shadow">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFB6C1]/10">
							{stat.icon}
						</div>
						<div>
							<p className="text-sm font-semibold text-gray-500">{stat.label}</p>
							<p className="text-2xl font-black text-gray-900">{stat.value}</p>
						</div>
					</div>
				))}
			</div>

			{showUpload && (
				<div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#FFB6C1]/15 animate-in fade-in slide-in-from-top-4 duration-300">
					<div className="mb-8 border-b border-[#FFB6C1]/10 pb-6">
						<h2 className="text-2xl font-bold text-gray-900">
							{editingId ? "Edit Post" : "Create New Post"}
						</h2>
						<p className="mt-1 text-sm text-gray-500">Provide details about your content to help it reach the right audience.</p>
					</div>

					<form onSubmit={handleUploadSubmit} className="space-y-8 max-w-4xl">
						<div className="grid gap-8 lg:grid-cols-2">
							{!editingId && (
								<div className="space-y-3 lg:col-span-2">
									<label className="text-sm font-bold text-gray-900 flex items-center gap-2">
										Media File <span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
									</label>
									<FileUploader onFileSelect={handleFileSelect} />
									{errors.file && (
										<p className="text-xs font-medium text-[#FFB6C1]">{errors.file}</p>
									)}
								</div>
							)}

							<div className="space-y-6">
								<h3 className="font-bold text-gray-900 border-b border-[#FFB6C1]/10 pb-2">Basic Info</h3>
								<div className="space-y-4">
									<div>
										<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
											Title <span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
										</label>
										<Input
											placeholder="A catchy title for your post"
											value={uploadData.title}
											onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
											error={errors.title}
										/>
									</div>
									<div>
										<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
											Caption <span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
										</label>
										<Input
											type="textarea"
											placeholder={aiLoading ? "AI is analyzing your image..." : "Tell the story behind this..."}
											value={uploadData.caption}
											onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
											error={errors.caption}
										/>
										{aiError && <p className="mt-1.5 text-xs text-[#c2185b] font-medium">{aiError}</p>}
									</div>
								</div>
							</div>

							<div className="space-y-6">
								<h3 className="font-bold text-gray-900 border-b border-[#FFB6C1]/10 pb-2">Context</h3>
								<div className="space-y-4">
									<div>
										<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
											Location <span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
										</label>
										<Input
											placeholder="Where was this captured?"
											value={uploadData.location}
											onChange={(e) => setUploadData({...uploadData, location: e.target.value})}
											error={errors.location}
										/>
									</div>
									<div>
										<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
											People
										</label>
										<div className="relative">
											<Input
												id="upload-people"
												placeholder="Search users or add tags (comma separated)"
												value={uploadData.people}
												onChange={(e) => setUploadData({...uploadData, people: e.target.value})}
												onFocus={() => setShowUserDropdown(true)}
												onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
												error={errors.people}
											/>
											{showUserDropdown && filteredUsers.length > 0 && (
												<div className="absolute z-10 w-full mt-1 bg-white border border-[#FFB6C1]/20 rounded-xl shadow-lg max-h-40 overflow-y-auto">
													{filteredUsers.map((u) => (
														<div
															key={u.id}
															className="px-4 py-2 hover:bg-[#FFB6C1]/10 cursor-pointer text-sm font-semibold text-gray-800 transition-colors"
															onClick={() => handleUserSelect(u.name)}
														>
															{u.name}
														</div>
													))}
												</div>
											)}
										</div>
										<p className="mt-1.5 text-xs text-gray-400">Example: John Doe, Jane Smith</p>
									</div>
								</div>
							</div>
						</div>

						{isUploading && (
							<div className="rounded-xl bg-gray-50 p-4 border border-[#FFB6C1]/10">
								<div className="flex items-center justify-between text-sm mb-2">
									<span className="font-semibold text-gray-700">Uploading media...</span>
									<span className="font-bold text-[#FFB6C1]">{uploadProgress}%</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
									<div
										className="h-full bg-gradient-to-r from-[#FFB6C1] to-[#f48fb1] transition-all duration-300 ease-out rounded-full"
										style={{width: `${uploadProgress}%`}}
									/>
								</div>
							</div>
						)}

						<div className="flex items-center justify-end gap-3 pt-6 border-t border-[#FFB6C1]/10">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setShowUpload(false)}
								className="font-semibold text-gray-500 hover:bg-gray-100"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								loading={isUploading}
								disabled={aiLoading}
								className="bg-gradient-to-r from-[#FFB6C1] to-[#f48fb1] hover:from-[#f48fb1] hover:to-[#ec407a] text-white font-bold px-8 py-2.5 rounded-xl shadow-md shadow-[#FFB6C1]/25 transition-all"
							>
								{editingId ? "Save Changes" : "Publish Post"}
							</Button>
						</div>
					</form>
				</div>
			)}

			<div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#FFB6C1]/15">
				<div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div>
						<h2 className="text-xl font-bold text-gray-900">Content Library</h2>
						<p className="mt-1 text-sm text-gray-500">Manage all your uploaded media</p>
					</div>
					<div className="relative w-full sm:w-72">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search content..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="block w-full rounded-xl border border-[#FFB6C1]/20 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-[#FFB6C1] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#FFB6C1]/10 transition-all"
						/>
					</div>
				</div>

				{loading ? (
					<SkeletonLoader type="grid" count={6} />
				) : filteredMedia.length === 0 ? (
					<div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#FFB6C1]/20 bg-[#FFB6C1]/5 py-20">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
							<svg className="h-8 w-8 text-[#FFB6C1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<p className="text-base font-bold text-gray-900">
							{searchQuery ? "No matches found" : "No content published yet"}
						</p>
						<p className="mt-1 text-sm text-gray-500">
							{searchQuery ? "Try a different search term" : "Upload your first photo or video"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{filteredMedia.map((item) => (
							<CreatorContentCard
								key={item.id}
								media={item}
								onEdit={startEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
