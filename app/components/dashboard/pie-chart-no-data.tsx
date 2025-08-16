export function PieChartNoData() {
	return (
		<div className="mt-6 flex flex-col gap-9">
			<div className="flex flex-col gap-4 px-16">
				<div className="aspect-square min-h-40 rounded-full bg-foreground/5" />
			</div>
			<div className="flex items-center justify-center gap-1.5">
				<div className="size-2 rounded-xs bg-foreground" />
				<p className="text-xs">No data for this month</p>
			</div>
		</div>
	);
}
