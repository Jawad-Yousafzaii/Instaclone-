export const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export const formatDate = (date) => {
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatRelativeTime = (date) => {
	const now = new Date();
	const diff = now - new Date(date);
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d ago`;
	if (hours > 0) return `${hours}h ago`;
	if (minutes > 0) return `${minutes}m ago`;
	return "just now";
};

export const getFileExtension = (filename) => {
	return filename.split(".").pop().toLowerCase();
};

export const isImageFile = (file) => {
	return file.type.startsWith("image/");
};

export const isVideoFile = (file) => {
	return file.type.startsWith("video/");
};

export const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const truncateText = (text, maxLength) => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength) + "...";
};

export const getInitials = (name) => {
	if (!name) return "?";
	const parts = name.trim().split(" ");
	if (parts.length === 1) return parts[0][0].toUpperCase();
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const cn = (...classes) => {
	return classes.filter(Boolean).join(" ");
};
