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
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-1">
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
								"transition-all duration-200",
								!readonly && "cursor-pointer hover:scale-120",
								readonly && "cursor-default",
							)}
						>
							<svg
								className={cn(
									sizes[size],
									isFilled || isHalf
										? "fill-accent-pink text-accent-pink drop-shadow-sm"
										: "fill-accent-grey text-accent-grey",
								)}
								viewBox="0 0 24 24"
							>
								{isHalf ? (
									<defs>
										<linearGradient id={`pink-half-${index}`}>
											<stop offset="50%" stopColor="#ff2d92" />
											<stop offset="50%" stopColor="#f0f0f0" />
										</linearGradient>
									</defs>
								) : null}
								<path
									fill={isHalf ? `url(#pink-half-${index})` : "currentColor"}
									d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
								/>
							</svg>
						</button>
					);
				})}
			</div>

			{showCount && count > 0 && (
				<span className="text-text-tertiary text-sm font-bold">({count})</span>
			)}
		</div>
	);
}
