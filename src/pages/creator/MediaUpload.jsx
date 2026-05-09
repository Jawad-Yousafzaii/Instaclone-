import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import FileUploader from "@/components/media/FileUploader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {MEDIA_TYPES, ROUTES} from "@/lib/constants/constants";
import {supabase} from "@/lib/supabase";
import {isImageFile, generateId} from "@/lib/utils/helpers";
import {mediaService} from "@/services/mediaService";
import {storageService} from "@/services/storageService";
import {videoCompressor, extractVideoFrame} from "@/services/videoCompressor";
import {useAuthStore} from "@/store/useAuthStore";

export default function MediaUpload() {
	const navigate = useNavigate();
	const {user} = useAuthStore();

	const [file, setFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [errors, setErrors] = useState({});

	const [aiLoading, setAiLoading] = useState(false);
	const [aiCaption, setAiCaption] = useState("");
	const [aiTags, setAiTags] = useState([]);
	const [aiError, setAiError] = useState("");

	const [compressionInfo, setCompressionInfo] = useState(null);
	const [videoMeta, setVideoMeta] = useState(null);

	const [uploadData, setUploadData] = useState({
		title: "",
		caption: "",
		location: "",
		people: "",
	});

	const [allUsers, setAllUsers] = useState([]);
	const [showUserDropdown, setShowUserDropdown] = useState(false);

	useEffect(() => {
		const fetchUsers = async () => {
			const {data} = await supabase.from("users").select("id, name");
			if (data) setAllUsers(data);
		};
		fetchUsers();
	}, []);

	const handleFileSelect = async (selectedFile) => {
		setFile(selectedFile);
		setAiCaption("");
		setAiTags([]);
		setAiError("");
		setCompressionInfo(null);
		setVideoMeta(null);

		if (selectedFile && isImageFile(selectedFile)) {
			setAiLoading(true);
			try {
				const result = await mediaService.analyzeImageWithAI(selectedFile);
				
				const aiCaption = result.description || "";
				const aiTags = result.tags ? `\n\n#${result.tags.split(", ").join(" #")}` : "";
				const finalCaption = `${aiCaption}${aiTags}`.trim();

				setAiCaption(aiCaption);
				
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

		if (selectedFile && !isImageFile(selectedFile)) {
			setAiLoading(true);
			try {
				try {
					const frameBlob = await extractVideoFrame(selectedFile);
					const result = await mediaService.analyzeImageWithAI(frameBlob);
					const aiCaption = result.description || "";
					const aiTags = result.tags ? `\n\n#${result.tags.split(", ").join(" #")}` : "";
					const finalCaption = `${aiCaption}${aiTags}`.trim();
					
					setAiCaption(aiCaption);
					setUploadData((prev) => ({
						...prev, 
						caption: finalCaption || prev.caption,
					}));
				} catch (aiErr) {
					setAiError("AI video analysis failed");
				}

				const meta = await videoCompressor.getVideoMetadata(selectedFile);
				setVideoMeta(meta);
				
				if ((meta.width >= 1920 || meta.height >= 1920) && meta.duration > 60) {
					const compressed = await videoCompressor.compressVideo(selectedFile);
					setCompressionInfo(compressed);
					if (compressed.compressed && compressed.file) {
						setFile(compressed.file);
					}
				} else {
					setCompressionInfo({
						compressed: false,
						originalSize: selectedFile.size,
						compressedSize: selectedFile.size,
						reason: "Optimal 1080p/Short Format. Transcoding skipped."
					});
				}
			} catch {
			} finally {
				setAiLoading(false);
			}
		}
	};

	const validateUpload = () => {
		const newErrors = {};
		if (!file) newErrors.file = "Please select a file";
		if (!uploadData.title) newErrors.title = "Title is required";
		if (!uploadData.caption) newErrors.caption = "Caption is required";
		if (!uploadData.location) newErrors.location = "Location is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const lastSearchWord = uploadData.people.split(",").pop().trim();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateUpload()) return;

		setIsUploading(true);
		setUploadProgress(10);

		try {
			const mediaId = generateId();
			setUploadProgress(15);

			const uploadFile = compressionInfo?.compressed ? compressionInfo.file : file;
			setUploadProgress(25);

			const result = await storageService.uploadFile(uploadFile, user.id, mediaId);
			setUploadProgress(60);

			const people = uploadData.people
				? uploadData.people.split(",").map((p) => p.trim())
				: [];

			const mediaType = isImageFile(file) ? MEDIA_TYPES.IMAGE : MEDIA_TYPES.VIDEO;

			await mediaService.createMedia({
				...uploadData,
				people,
				url: result.url,
				thumbnail: result.url,
				creatorId: user.id,
				type: mediaType,
			});

			setUploadProgress(100);
			setTimeout(() => {
				navigate(ROUTES.CREATOR.DASHBOARD);
			}, 500);
		} catch (error) {
			setErrors({general: error.message});
			setIsUploading(false);
		}
	};

	return (
		<div className="space-y-8 max-w-4xl">
			<div>
				<h1 className="text-2xl font-black tracking-tight text-gray-900">Upload Media</h1>
				<p className="mt-1 text-sm font-medium text-gray-500">Share your photos and videos with the world.</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15">
					<label className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
						Media File
						<span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
					</label>
					<FileUploader onFileSelect={handleFileSelect} />
					{errors.file && (
						<p className="mt-2 text-xs font-medium text-[#FFB6C1]">{errors.file}</p>
					)}
				</div>

				{videoMeta && (
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15">
						<div className="flex items-center gap-2 mb-4">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
								<svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
								</svg>
							</div>
							<h3 className="text-sm font-bold text-gray-900">Video Processing</h3>
							<span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
								Cloud-Native
							</span>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							<div className="rounded-xl bg-gray-50 px-3 py-2.5">
								<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Size</p>
								<p className="text-sm font-bold text-gray-900">{videoCompressor.formatSize(videoMeta.size)}</p>
							</div>
							{videoMeta.width > 0 && (
								<div className="rounded-xl bg-gray-50 px-3 py-2.5">
									<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Resolution</p>
									<p className="text-sm font-bold text-gray-900">{videoMeta.width}×{videoMeta.height}</p>
								</div>
							)}
							{videoMeta.duration > 0 && (
								<div className="rounded-xl bg-gray-50 px-3 py-2.5">
									<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Duration</p>
									<p className="text-sm font-bold text-gray-900">{Math.round(videoMeta.duration)}s</p>
								</div>
							)}
							<div className="rounded-xl bg-gray-50 px-3 py-2.5">
								<p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Format</p>
								<p className="text-sm font-bold text-gray-900">{videoMeta.type.split("/")[1]?.toUpperCase()}</p>
							</div>
						</div>
						{compressionInfo && (
							<div className="mt-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-4 py-2.5">
								<p className="text-xs text-blue-700 font-medium">
									{compressionInfo.compressed
										? `Compressed: ${videoCompressor.formatSize(compressionInfo.originalSize)} → ${videoCompressor.formatSize(compressionInfo.compressedSize)} (${Math.round((1 - compressionInfo.compressedSize / compressionInfo.originalSize) * 100)}% smaller)`
										: "Azure Media Services cloud-native pipeline ready for production transcoding"}
								</p>
							</div>
						)}
					</div>
				)}

				{(aiLoading || aiCaption || aiError) && (
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15">
						<div className="flex items-center gap-2 mb-4">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFB6C1]/20 to-[#f48fb1]/20">
								<svg className="h-4 w-4 text-[#c2185b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
								</svg>
							</div>
							<h3 className="text-sm font-bold text-gray-900">AI Analysis</h3>
							{aiLoading && (
								<div className="flex items-center gap-2 ml-auto">
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFB6C1]/30 border-t-[#FFB6C1]" />
									<span className="text-xs font-semibold text-[#FFB6C1]">
										{file && isImageFile(file) ? "Analyzing image metadata..." : "Processing & Optimizing for Cloud..."}
									</span>
								</div>
							)}
						</div>

						{aiError && (
							<div className="rounded-xl border border-[#FFB6C1]/50 bg-[#FFB6C1]/10 px-4 py-3 text-sm text-[#c2185b] font-medium">
								{aiError}
							</div>
						)}


					</div>
				)}

				<div className="grid gap-6 lg:grid-cols-2">
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15 space-y-5">
						<h3 className="font-bold text-gray-900 border-b border-[#FFB6C1]/10 pb-3">Basic Info</h3>
						<div>
							<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
								Title
								<span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
							</label>
							<Input
								id="upload-title"
								placeholder="A catchy title for your post"
								value={uploadData.title}
								onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
								error={errors.title}
							/>
						</div>
						<div>
							<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
								Caption
								<span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
							</label>
							<Input
								id="upload-caption"
								type="textarea"
								placeholder={aiLoading ? "AI is analyzing your image..." : "Tell the story behind this..."}
								value={uploadData.caption}
								onChange={(e) => setUploadData({...uploadData, caption: e.target.value})}
								error={errors.caption}
							/>
							{aiError && <p className="mt-1.5 text-xs text-[#c2185b] font-medium">{aiError}</p>}
						</div>
					</div>

					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#FFB6C1]/15 space-y-5">
						<h3 className="font-bold text-gray-900 border-b border-[#FFB6C1]/10 pb-3">Context</h3>
						<div>
							<label className="text-sm font-bold text-gray-900 mb-1.5 block flex items-center gap-2">
								Location
								<span className="text-xs font-normal text-[#FFB6C1] px-2 py-0.5 rounded bg-[#FFB6C1]/10">Required</span>
							</label>
							<Input
								id="upload-location"
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
							<p className="mt-1.5 text-xs text-gray-400">Example: Nature, Landscape, John Doe</p>
						</div>
					</div>
				</div>

				{errors.general && (
					<div className="rounded-xl border border-[#FFB6C1]/50 bg-[#FFB6C1]/10 px-4 py-3 text-sm text-[#c2185b] font-medium">
						{errors.general}
					</div>
				)}

				{isUploading && (
					<div className="rounded-xl bg-white p-4 ring-1 ring-[#FFB6C1]/15 shadow-sm">
						<div className="flex items-center justify-between text-sm mb-2">
							<span className="font-semibold text-gray-700">
								{file && !isImageFile(file) && compressionInfo?.compressed ? "Compressing high-quality video..." : "Uploading media..."}
							</span>
							<span className="font-bold text-[#FFB6C1]">{uploadProgress}%</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 mb-2">
							<div
								className="h-full bg-gradient-to-r from-[#FFB6C1] to-[#f48fb1] transition-all duration-300 ease-out rounded-full"
								style={{width: `${uploadProgress}%`}}
							/>
						</div>
						<p className="text-[10px] font-medium text-[#c2185b] text-right">Scalable Delivery via Azure Storage</p>
					</div>
				)}

				<div className="flex items-center justify-end gap-3 pt-4">
					<Button
						type="button"
						variant="ghost"
						onClick={() => navigate(ROUTES.CREATOR.DASHBOARD)}
						className="font-semibold text-gray-500 hover:bg-gray-100 px-6 py-2.5 rounded-xl"
					>
						Cancel
					</Button>
					<Button
						id="upload-submit-btn"
						type="submit"
						loading={isUploading}
						disabled={aiLoading}
						className="bg-gradient-to-r from-[#FFB6C1] to-[#f48fb1] hover:from-[#f48fb1] hover:to-[#ec407a] text-white font-bold px-8 py-2.5 rounded-xl shadow-md shadow-[#FFB6C1]/25 transition-all hover:shadow-lg hover:-translate-y-0.5"
					>
						Publish Post
					</Button>
				</div>
			</form>
		</div>
	);
}
