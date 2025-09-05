import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { ChartNoAxesColumnIcon } from "lucide-react";
import { NavMenu } from "./nav-menu";
import { ModeToggle } from "./theme-toggle";

export const Nav = () => {
	return (
		<nav className="h-16 w-full">
			<div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
				<div className="flex gap-3">
					<ChartNoAxesColumnIcon />
					<h2 className="font-semibold">Finance Tracker</h2>
				</div>
				<div className="flex items-center gap-8">
					<NavMenu />
				</div>
				<div className="flex items-center gap-3">
					<ModeToggle />

					<SignedOut>
						<SignInButton />
						<SignUpButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</nav>
	);
};
