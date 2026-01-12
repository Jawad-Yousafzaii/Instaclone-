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
						"cursor-pointer rounded-[2rem] border-2 border-dashed p-12 text-center transition-all duration-300",
						isDragging
							? "border-accent-pink bg-accent-pink/5"
							: "hover:border-accent-pink/50 border-accent-grey hover:bg-white",
					)}
				>
					<div className="flex flex-col items-center gap-6">
						<div className="gradient-accent shadow-glow-pink flex h-20 w-20 items-center justify-center rounded-[1.5rem]">
							<svg
								className="h-10 w-10 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						<div>
							<p className="text-text-primary mb-2 text-xl font-black tracking-tight">
								Select or Drop Masterpiece
							</p>
							<p className="text-text-tertiary text-sm font-bold">
								Photos or Videos up to 100MB
							</p>
							<p className="text-accent-pink mt-2 text-xs font-black tracking-widest uppercase opacity-60">
								JPG • PNG • MP4 • MOV
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="border-accent-grey overflow-hidden rounded-[2rem] border bg-white shadow-sm">
					{preview.type === "image" ? (
						<img
							src={preview.url}
							alt="Preview"
							className="h-72 w-full object-cover"
						/>
					) : (
						<video
							src={preview.url}
							controls
							className="h-72 w-full bg-black"
						/>
					)}

					<div className="border-accent-grey flex items-center justify-between border-t p-6">
						<div>
							<p className="text-text-primary font-black tracking-tight">
								{preview.name}
							</p>
							<p className="text-text-tertiary text-sm font-bold">
								{formatFileSize(preview.size)}
							</p>
						</div>

						<button
							onClick={clearFile}
							className="bg-accent-grey/50 text-accent-magenta hover:bg-accent-magenta rounded-2xl p-4 font-bold transition-all hover:text-white"
						>
							Remove
						</button>
					</div>
				</div>
			)}

			{error && (
				<div className="bg-accent-magenta/10 border-accent-magenta/20 text-accent-magenta flex items-center gap-2 rounded-xl border px-4 py-3 text-sm">
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					{error}
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
