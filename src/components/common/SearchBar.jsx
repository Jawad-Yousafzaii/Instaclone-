import {useState, useEffect} from "react";
import Input from "@/components/ui/Input";

export default function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
}) {
	const [searchValue, setSearchValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			onChange(searchValue);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchValue, onChange]);

	useEffect(() => {
		setSearchValue(value);
	}, [value]);

	return (
		<div className="relative">
			<svg
				className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-white/40"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>

			<input
				type="text"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				placeholder={placeholder}
				className="glass focus:ring-accent-cyan/50 w-full rounded-xl py-3.5 pr-4 pl-12 text-white transition-all placeholder:text-white/40 focus:ring-2 focus:outline-none"
			/>
		</div>
	);
}
