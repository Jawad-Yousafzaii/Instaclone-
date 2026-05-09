export const videoCompressor = {
	async compressVideo(file, options = {}) {
		const maxSizeMB = options.maxSizeMB || 25;
		const maxSizeBytes = maxSizeMB * 1024 * 1024;

		if (file.size <= maxSizeBytes) {
			return {
				file,
				compressed: false,
				originalSize: file.size,
				compressedSize: file.size,
				savings: 0,
			};
		}

		if (typeof window.VideoEncoder === "undefined") {
			return {
				file,
				compressed: false,
				originalSize: file.size,
				compressedSize: file.size,
				savings: 0,
				reason: "WebCodecs not supported - uploading original",
			};
		}

		try {
			const bitmap = await createImageBitmap(
				await extractVideoFrame(file),
			);

			const canvas = document.createElement("canvas");
			const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
			canvas.width = Math.round(bitmap.width * scale);
			canvas.height = Math.round(bitmap.height * scale);

			const ctx = canvas.getContext("2d");
			ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

			const thumbnailBlob = await new Promise((resolve) =>
				canvas.toBlob(resolve, "image/jpeg", 0.8),
			);

			return {
				file,
				compressed: false,
				originalSize: file.size,
				compressedSize: file.size,
				thumbnail: thumbnailBlob,
				dimensions: {width: canvas.width, height: canvas.height},
				reason: "Cloud-native processing via Azure Media Services recommended for production compression",
			};
		} catch {
			return {
				file,
				compressed: false,
				originalSize: file.size,
				compressedSize: file.size,
				savings: 0,
			};
		}
	},

	getVideoMetadata(file) {
		return new Promise((resolve) => {
			const video = document.createElement("video");
			video.preload = "metadata";
			video.onloadedmetadata = () => {
				URL.revokeObjectURL(video.src);
				resolve({
					duration: video.duration,
					width: video.videoWidth,
					height: video.videoHeight,
					aspectRatio: video.videoWidth / video.videoHeight,
					size: file.size,
					type: file.type,
					name: file.name,
				});
			};
			video.onerror = () => {
				URL.revokeObjectURL(video.src);
				resolve({
					duration: 0,
					width: 0,
					height: 0,
					aspectRatio: 1,
					size: file.size,
					type: file.type,
					name: file.name,
				});
			};
			video.src = URL.createObjectURL(file);
		});
	},

	formatSize(bytes) {
		if (bytes < 1024) return bytes + " B";
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
		return (bytes / (1024 * 1024)).toFixed(1) + " MB";
	},
};

export function extractVideoFrame(file) {
	return new Promise((resolve, reject) => {
		const video = document.createElement("video");
		video.preload = "auto";
		video.muted = true;
		video.playsInline = true;

		video.onloadeddata = () => {
			video.currentTime = Math.min(1, video.duration * 0.1);
		};

		video.onseeked = () => {
			const canvas = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0);
			canvas.toBlob(
				(blob) => {
					URL.revokeObjectURL(video.src);
					resolve(blob);
				},
				"image/jpeg",
				0.8,
			);
		};

		video.onerror = () => {
			URL.revokeObjectURL(video.src);
			reject(new Error("Failed to load video"));
		};

		video.src = URL.createObjectURL(file);
	});
}
