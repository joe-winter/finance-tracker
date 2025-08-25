import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { GaugeIcon, SettingsIcon, WalletIcon } from "lucide-react";
import Link from "next/link";

const pages = [
	{ name: "Dashboard", path: "/dashboard", icon: GaugeIcon },
	{ name: "Finances", path: "/finances", icon: WalletIcon },
	{ name: "Settings", path: "/settings", icon: SettingsIcon },
];

export const BottomNav = (props: NavigationMenuProps) => {
	return (
		<div
			{...props}
			className="fixed bottom-0 mb-2 flex items-center justify-center gap-12 rounded-full border bg-card px-8 py-4 opacity-95 md:hidden"
		>
			{pages.map((page) => (
				<Link
					href={page.path}
					key={page.name}
					className="flex flex-col items-center gap-2"
				>
					<page.icon className="size-4 stroke-foreground" />
					<span className="font-semibold text-sm">{page.name}</span>
				</Link>
			))}
		</div>
	);
};
