import type { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { GaugeIcon, SettingsIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/navigation-menu";

export const NavMenu = (props: NavigationMenuProps) => (
	<NavigationMenu {...props}>
		<NavigationMenuList className="gap-6 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
			<NavigationMenuItem>
				<NavigationMenuLink asChild>
					<Link href="/dashboard" className="flex-row items-center gap-2">
						<GaugeIcon className="stroke-foreground" />
						<span>Dashboard</span>
					</Link>
				</NavigationMenuLink>
			</NavigationMenuItem>
			<NavigationMenuItem>
				<NavigationMenuLink asChild>
					<Link href="/finances" className="flex-row items-center gap-2">
						<WalletIcon className="stroke-foreground" />
						<span>Finances</span>
					</Link>
				</NavigationMenuLink>
			</NavigationMenuItem>
			<NavigationMenuItem>
				<NavigationMenuLink asChild>
					<Link href="/settings" className="flex-row items-center gap-2">
						<SettingsIcon className="stroke-foreground" />
						<span>Settings</span>
					</Link>
				</NavigationMenuLink>
			</NavigationMenuItem>
		</NavigationMenuList>
	</NavigationMenu>
);
