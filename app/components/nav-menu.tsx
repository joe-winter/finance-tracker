"use client";

import { GaugeIcon, SettingsIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const pages = [
	{ name: "Dashboard", path: "/dashboard", icon: GaugeIcon },
	{ name: "Finances", path: "/finances", icon: WalletIcon },
	{ name: "Settings", path: "/settings", icon: SettingsIcon },
];

export const NavMenu = () => {
	const pathname = usePathname();
	return (
		<div className="hidden gap-8 md:flex">
			{pages.map((page) => {
				const isActive = pathname === page.path;
				return (
					<Link
						href={page.path}
						key={page.name}
						className="flex flex-row items-center gap-1"
					>
						<page.icon className="size-4 stroke-foreground" />
						<span
							className={cn(
								"text-sm",
								isActive ? "font-bold" : "font-semibold",
							)}
						>
							{page.name}
						</span>
					</Link>
				);
			})}
		</div>
	);
};
