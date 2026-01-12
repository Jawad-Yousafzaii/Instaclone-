import {useState, useRef, useEffect} from "react";
import {cn} from "@/lib/utils/helpers";

export default function Dropdown({
	trigger,
	children,
	align = "right",
	className = "",
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative inline-block" ref={dropdownRef}>
			<div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

			{isOpen && (
				<div
					className={cn(
						"glass-strong animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 min-w-[220px] rounded-2xl py-2 duration-200",
						align === "right" ? "right-0" : "left-0",
						className,
					)}
				>
					{children}
				</div>
			)}
		</div>
	);
}

Dropdown.Item = function DropdownItem({children, onClick, className = ""}) {
	return (
		<button
			onClick={onClick}
			className={cn(
				"text-text-secondary hover:bg-accent-grey hover:text-text-primary flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-all duration-200",
				className,
			)}
		>
			{children}
		</button>
	);
};

Dropdown.Divider = function DropdownDivider() {
	return <div className="border-accent-grey my-2 border-t" />;
};
