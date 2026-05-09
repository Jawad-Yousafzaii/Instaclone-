import {useState} from "react";
import {RATING_MAX} from "@/lib/constants/constants";
import {cn} from "@/lib/utils/helpers";

export default function RatingComponent({
	value = 0,
	onChange,
	readonly = false,
	size = "md",
	showCount = false,
	count = 0,
}) {
	const [hoverValue, setHoverValue] = useState(0);

	const sizes = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	const displayValue = readonly ? value : hoverValue || value;

	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-0.5">
				{Array.from({length: RATING_MAX}).map((_, index) => {
					const starValue = index + 1;
					const isFilled = starValue <= displayValue;
					const isHalf = !isFilled && starValue - 0.5 <= displayValue;

					return (
						<button
							key={index}
							type="button"
							disabled={readonly}
							onClick={() => !readonly && onChange && onChange(starValue)}
							onMouseEnter={() => !readonly && setHoverValue(starValue)}
							onMouseLeave={() => !readonly && setHoverValue(0)}
							className={cn(
								"transition-all duration-150",
								!readonly && "cursor-pointer hover:scale-125",
								readonly && "cursor-default",
							)}
						>
							<svg
								className={cn(
									sizes[size],
									isFilled || isHalf
										? "text-[#FFB6C1] drop-shadow-sm"
										: "text-gray-200",
								)}
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								{isHalf ? (
									<defs>
										<linearGradient id={`star-half-${index}`}>
											<stop offset="50%" stopColor="#FFB6C1" />
											<stop offset="50%" stopColor="#e5e7eb" />
										</linearGradient>
									</defs>
								) : null}
								<path
									fill={isHalf ? `url(#star-half-${index})` : "currentColor"}
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
						</button>
					);
				})}
			</div>

			{showCount && count > 0 && (
				<span className="text-xs font-semibold text-gray-400">({count})</span>
			)}
		</div>
	);
}
