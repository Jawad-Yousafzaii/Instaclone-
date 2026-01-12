import {useEffect} from "react";
import {cn} from "@/lib/utils/helpers";

const sizes = {
	small: "max-w-md",
	medium: "max-w-2xl",
	large: "max-w-4xl",
	fullscreen: "max-w-[95vw] h-[95vh]",
};

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	size = "medium",
	showCloseButton = true,
}) {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop with blur */}
			<div
				className="absolute inset-0 bg-black/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className={cn(
					"glass-strong relative w-full transform rounded-3xl transition-all duration-300",
					sizes[size],
					isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
				)}
			>
				{(title || showCloseButton) && (
					<div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
						{title && (
							<h2 className="text-xl font-semibold text-white">{title}</h2>
						)}
						{showCloseButton && (
							<button
								onClick={onClose}
								className="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}
					</div>
				)}

				<div className="p-6">{children}</div>
			</div>
		</div>
	);
}
