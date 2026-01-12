import {USER_ROLES} from "@/lib/constants/constants";
import {cn} from "@/lib/utils/helpers";

export default function RoleSelector({value, onChange}) {
	const options = [
		{
			value: USER_ROLES.CONSUMER,
			label: "Consumer",
			studio: "EXPLORER STUDIO",
			description: "Discover and collect world-class creative works.",
		},
		{
			value: USER_ROLES.CREATOR,
			label: "Creator",
			studio: "CREATOR STUDIO",
			description: "Publish your portfolio and manage your legacy.",
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4">
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={cn(
						"group relative flex flex-col items-start rounded-[2rem] p-6 text-left transition-all duration-500",
						"border-accent-grey/50 hover:border-accent-pink/30 border",
						value === option.value
							? "glass-strong shadow-glass border-accent-pink/40 ring-accent-pink/5 scale-[1.02] ring-1"
							: "glass opacity-60 hover:opacity-100",
					)}
				>
					{/* Selected Indicator */}
					<div
						className={cn(
							"absolute top-4 right-4 h-2 w-2 rounded-full transition-all duration-500",
							value === option.value
								? "bg-accent-pink shadow-glow-pink scale-100"
								: "bg-accent-grey scale-0",
						)}
					/>

					<span
						className={cn(
							"text-[10px] font-black tracking-[0.3em] uppercase transition-colors duration-300",
							value === option.value ? "text-accent-pink" : "text-text-muted",
						)}
					>
						{option.studio}
					</span>

					<h3
						className={cn(
							"mt-2 text-2xl font-black tracking-tighter transition-colors duration-300",
							value === option.value
								? "text-text-primary"
								: "text-text-secondary",
						)}
					>
						{option.label}
					</h3>

					<p
						className={cn(
							"mt-3 text-xs leading-relaxed font-bold transition-colors duration-300",
							value === option.value
								? "text-text-secondary"
								: "text-text-muted",
						)}
					>
						{option.description}
					</p>

					{/* Subtle Glow Backdrop on select */}
					{value === option.value && (
						<div className="bg-accent-pink/5 absolute inset-0 -z-10 rounded-[2rem] blur-2xl" />
					)}
				</button>
			))}
		</div>
	);
}
