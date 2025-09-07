"use client";

import { ChevronLeftIcon, SearchIcon, XIcon } from "lucide-react";
import { type JSX, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ExpandableSearchProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	buttonIcon?: JSX.Element;
	onClear?: () => void;
}

export const ExpandableSearch = ({
	placeholder = "Search...",
	value,
	onChange,
	buttonIcon = <SearchIcon size={16} />,
	onClear,
	...props
}: ExpandableSearchProps) => {
	const [open, setOpen] = useState(false);

	return open ? (
		<div className="*:not-first:mt-2">
			<div className="relative">
				<Input
					className="peer h-8 w-40 ps-9 lg:w-56"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					{...props}
				/>
				{open ? (
					<button
						className="absolute inset-y-0 start-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
						onClick={() => setOpen(false)}
						type="button"
					>
						<ChevronLeftIcon size={16} aria-hidden="true" />
					</button>
				) : (
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<SearchIcon size={16} />
					</div>
				)}
				<button
					className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					onClick={() => {
						setOpen(false);
						onClear?.();
					}}
					type="button"
				>
					<XIcon size={16} aria-hidden="true" />
				</button>
			</div>
		</div>
	) : (
		<Button
			size="sm"
			variant="outline"
			className="has-[>svg]:px-2"
			onClick={() => setOpen(true)}
		>
			{buttonIcon}
		</Button>
	);
};
