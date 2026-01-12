import Button from "./Button";

export default function EmptyState({
	icon,
	title,
	description,
	action,
	onAction,
}) {
	return (
		<div className="glass flex flex-col items-center justify-center rounded-3xl p-12 text-center">
			{icon && (
				<div className="mb-6 text-white/60">
					{typeof icon === "string" ? (
						<div className="text-6xl">{icon}</div>
					) : (
						icon
					)}
				</div>
			)}

			{title && (
				<h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
			)}

			{description && (
				<p className="mb-6 max-w-md text-white/60">{description}</p>
			)}

			{action && onAction && (
				<Button onClick={onAction} variant="primary">
					{action}
				</Button>
			)}
		</div>
	);
}
