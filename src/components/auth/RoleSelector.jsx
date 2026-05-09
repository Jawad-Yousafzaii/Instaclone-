import {USER_ROLES} from "@/lib/constants/constants";
import {cn} from "@/lib/utils/helpers";

export default function RoleSelector({value, onChange}) {
	const options = [
		{
			value: USER_ROLES.CONSUMER,
			label: "Consumer",
		},
		{
			value: USER_ROLES.CREATOR,
			label: "Creator",
		},
	];

	return (
		<div className="flex gap-2">
			{options.map((option) => (
				<button
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={cn(
						"flex-1 flex items-center justify-center rounded border py-2.5 px-3 transition-colors text-sm font-semibold",
						value === option.value
							? "border-[#FFB6C1] bg-[#FFB6C1]/5 text-[#c2185b]"
							: "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
					)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
}
