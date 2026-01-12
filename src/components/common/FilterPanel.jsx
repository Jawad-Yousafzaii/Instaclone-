import Button from "@/components/ui/Button";

const sortOptions = [
	{value: "newest", label: "Newest"},
	{value: "oldest", label: "Oldest"},
	{value: "popular", label: "Popular"},
	{value: "highest-rated", label: "Top Rated"},
];

export default function FilterPanel({filters, onChange, onReset}) {
	const handleChange = (key, value) => {
		onChange({[key]: value});
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			{/* Sort Pills */}
			{sortOptions.map((option) => (
				<button
					key={option.value}
					onClick={() => handleChange("sortBy", option.value)}
					className={`rounded-full px-4 py-2 transition-all duration-300 ${
						filters.sortBy === option.value
							? "from-accent-cyan to-accent-violet bg-gradient-to-r text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]"
							: "glass text-white/70 hover:bg-white/15 hover:text-white"
					}`}
				>
					<span className="text-sm font-medium">{option.label}</span>
				</button>
			))}

			{/* Location Input */}
			<div className="relative">
				<input
					type="text"
					placeholder="Location..."
					value={filters.location || ""}
					onChange={(e) => handleChange("location", e.target.value)}
					className="glass focus:ring-accent-cyan/50 w-32 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/50 focus:ring-2 focus:outline-none"
				/>
			</div>

			{/* Reset Button */}
			<button
				onClick={onReset}
				className="glass rounded-full px-4 py-2 text-sm text-white/60 transition-all hover:bg-white/15 hover:text-white"
			>
				Reset
			</button>
		</div>
	);
}
