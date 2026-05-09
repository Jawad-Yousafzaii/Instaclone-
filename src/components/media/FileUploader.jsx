import {useState, useRef} from "react";
import {config} from "@/lib/config/config";
import {cn, isImageFile, formatFileSize} from "@/lib/utils/helpers";

export default function FileUploader({
	onFileSelect,
	accept = "image/*,video/*",
}) {
	const [isDragging, setIsDragging] = useState(false);
	const [preview, setPreview] = useState(null);
	const [error, setError] = useState("");
	const fileInputRef = useRef(null);

	const validateFile = (file) => {
		if (file.size > config.upload.maxFileSize) {
			return `File size must be less than ${formatFileSize(config.upload.maxFileSize)}`;
		}

		const allowedTypes = [
			...config.upload.allowedImageTypes,
			...config.upload.allowedVideoTypes,
		];

		if (!allowedTypes.includes(file.type)) {
			return "File type not supported. Please upload an image or video.";
		}

		return null;
	};

	const handleFile = (file) => {
		setError("");

		const validationError = validateFile(file);
		if (validationError) {
			setError(validationError);
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			setPreview({
				url: e.target.result,
				type: isImageFile(file) ? "image" : "video",
				name: file.name,
				size: file.size,
			});
		};
		reader.readAsDataURL(file);

		if (onFileSelect) {
			onFileSelect(file);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file) {
			handleFile(file);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleFileInput = (e) => {
		const file = e.target.files[0];
		if (file) {
			handleFile(file);
		}
	};

	const clearFile = () => {
		setPreview(null);
		setError("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		if (onFileSelect) {
			onFileSelect(null);
		}
	};

	return (
		<div className="space-y-4">
			{!preview ? (
				<div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => fileInputRef.current?.click()}
					className={cn(
						"cursor-pointer rounded-2xl border-2 border-dashed p-14 text-center transition-all duration-300 bg-white",
						isDragging
							? "border-[#FFB6C1] bg-[#FFB6C1]/5 shadow-inner scale-[0.99]"
							: "border-gray-200 hover:border-[#FFB6C1] hover:bg-gray-50",
					)}
				>
					<div className="flex flex-col items-center gap-5">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFB6C1]/15 text-[#FFB6C1] group-hover:scale-110 transition-transform">
							<svg
								className="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						<div>
							<p className="mb-1 text-lg font-bold text-gray-900">
								Drag and drop your media
							</p>
							<p className="text-sm font-medium text-gray-500">
								or click to browse your files
							</p>
							<div className="mt-4 flex items-center justify-center gap-2">
								<span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">JPG</span>
								<span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">PNG</span>
								<span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">MP4</span>
								<span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">MOV</span>
							</div>
							<p className="mt-3 text-xs font-medium text-gray-400">Up to 100MB</p>
						</div>
					</div>
				</div>
			) : (
				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm relative group">
					{preview.type === "image" ? (
						<img
							src={preview.url}
							alt="Preview"
							className="h-[300px] w-full object-contain bg-gray-50"
						/>
					) : (
						<video
							src={preview.url}
							controls
							className="h-[300px] w-full bg-black"
						/>
					)}

					<div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
						<div className="flex-1 min-w-0 mr-4">
							<p className="text-white font-bold tracking-tight truncate text-sm">
								{preview.name}
							</p>
							<p className="text-gray-300 text-xs font-medium">
								{formatFileSize(preview.size)}
							</p>
						</div>

						<button
							onClick={clearFile}
							className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-600 transition-colors shrink-0"
							title="Remove media"
						>
							<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
					<svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					<span className="font-medium">{error}</span>
				</div>
			)}

			<input
				ref={fileInputRef}
				type="file"
				accept={accept}
				onChange={handleFileInput}
				className="hidden"
			/>
		</div>
	);
}
