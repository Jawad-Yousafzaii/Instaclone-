import {useState, useEffect} from "react";
import FileUploader from "@/components/media/FileUploader";
import MediaCard from "@/components/media/MediaCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SkeletonLoader from "@/components/ui/SkeletonLoader";
import {MEDIA_TYPES} from "@/lib/constants/constants";
import {isImageFile, generateId, formatDate} from "@/lib/utils/helpers";
import {mediaService} from "@/services/mediaService";
import {storageService} from "@/services/storageService";
import {useAuthStore} from "@/store/useAuthStore";

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

	// Upload Form State
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

	// Edit State
	const [editingId, setEditingId] = useState(null);

	useEffect(() => {
		loadMedia();
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
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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
			location: item.location,
			people: item.people?.join(", "),
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
			gradient: "from-pink-100 to-pink-50",
		},
		{
			label: "Total Views",
			value: stats.totalViews.toLocaleString(),
			gradient: "from-white to-pink-50",
		},
		{
			label: "Total Ratings",
			value: stats.totalRatings,
			gradient: "from-pink-50 to-white",
		},
		{
			label: "Avg Rating",
			value: stats.averageRating.toFixed(1),
			gradient: "from-pink-100 to-white",
		},
	];

	return (
		<div className="space-y-12">
			{/* Header & Stats */}
			<div className="space-y-8">
				<div className="text-center">
					<h1 className="text-text-primary mb-2 text-4xl font-bold tracking-tight">
						Welcome back, {user?.name?.split(" ")[0]}
					</h1>
					<p className="text-text-secondary">Your creator performance studio</p>
				</div>
			</div>

			<div className="flex flex-col items-center gap-6">
				<Button
					variant="primary"
					className="shadow-glow-pink min-w-[200px] py-4 text-lg"
					onClick={() => {
						if (showUpload && editingId) {
							setEditingId(null);
							setUploadData({title: "", caption: "", location: "", people: ""});
						} else {
							setShowUpload(!showUpload);
						}
					}}
				>
					{showUpload && !editingId
						? "Cancel Upload"
						: editingId
							? "Cancel Editing"
							: "Add New Media"}
				</Button>

				{/* Expandable Upload Form */}
				{showUpload && (
					<div className="glass-strong animate-in fade-in slide-in-from-top-4 w-full max-w-3xl rounded-3xl p-8 duration-500">
						<h2 className="text-text-primary mb-6 text-2xl font-bold">
							{editingId ? "Edit Media" : "New Media"}
						</h2>
						<form onSubmit={handleUploadSubmit} className="space-y-6">
							{!editingId && (
								<div className="space-y-2">
									<label className="text-text-secondary text-sm font-medium">
										File
									</label>
									<FileUploader onFileSelect={setFile} />
									{errors.file && (
										<p className="text-accent-magenta text-xs">{errors.file}</p>
									)}
								</div>
							)}

							<div className="grid gap-6 md:grid-cols-2">
								<Input
									label="Title"
									placeholder="Give it a name"
									value={uploadData.title}
									onChange={(e) =>
										setUploadData({...uploadData, title: e.target.value})
									}
									error={errors.title}
								/>
								<Input
									label="Location"
									placeholder="Where was this?"
									value={uploadData.location}
									onChange={(e) =>
										setUploadData({...uploadData, location: e.target.value})
									}
								/>
							</div>

							<Input
								label="Caption"
								type="textarea"
								placeholder="What's the story?"
								value={uploadData.caption}
								onChange={(e) =>
									setUploadData({...uploadData, caption: e.target.value})
								}
								error={errors.caption}
							/>

							<Input
								label="Tag People (comma separated)"
								placeholder="John, Jane..."
								value={uploadData.people}
								onChange={(e) =>
									setUploadData({...uploadData, people: e.target.value})
								}
							/>

							{isUploading && (
								<div className="space-y-2">
									<div className="flex justify-between text-xs">
										<span className="text-text-tertiary">Progress</span>
										<span className="text-accent-pink font-bold">
											{uploadProgress}%
										</span>
									</div>
									<div className="bg-accent-grey h-1.5 w-full overflow-hidden rounded-full">
										<div
											className="bg-accent-pink h-full transition-all duration-300"
											style={{width: `${uploadProgress}%`}}
										/>
									</div>
								</div>
							)}

							<Button
								type="submit"
								variant="primary"
								className="w-full py-4 text-base"
								loading={isUploading}
							>
								{editingId ? "Save Changes" : "Post Media"}
							</Button>
						</form>
					</div>
				)}
			</div>

			{/* Media Library */}
			<div className="border-accent-grey space-y-8 border-t pt-12">
				<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
					<h2 className="text-text-primary text-3xl font-bold">Your Content</h2>
					<div className="relative w-full sm:w-72">
						<input
							type="text"
							placeholder="Search library..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="glass-strong border-accent-grey text-text-primary placeholder:text-text-muted focus:ring-accent-pink/20 w-full rounded-2xl px-6 py-4 font-bold transition-all focus:ring-4 focus:outline-none"
						/>
					</div>
				</div>

				{loading ? (
					<SkeletonLoader type="grid" count={6} />
				) : filteredMedia.length === 0 ? (
					<div className="glass rounded-3xl p-16 text-center">
						<p className="text-text-tertiary text-xl font-medium">
							{searchQuery ? "No matches found" : "No content yet"}
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{filteredMedia.map((item) => (
							<div key={item.id} className="group relative">
								<MediaCard media={item} />
								<div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
									<button
										onClick={() => startEdit(item)}
										className="text-text-primary rounded-xl bg-white/90 px-4 py-2 text-xs font-bold shadow-sm transition-colors hover:bg-white"
									>
										Edit
									</button>
									<button
										onClick={() => handleDelete(item.id)}
										className="bg-accent-magenta rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:brightness-110"
									>
										Delete
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
