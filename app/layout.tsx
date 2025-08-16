import type { Metadata } from "next";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TRPCProvider from "@/app/_trpc/Provider";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/theme-toggle";
import { Nav } from "./components/nav";
import { shadcn } from "@clerk/themes";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Finance Tracker",
	description: "Finance tracker create with Next JS",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider appearance={{ theme: shadcn }}>
			<TRPCProvider>
				<html lang="en" suppressHydrationWarning>
					<body
						className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center antialiased`}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<header className="flex h-16 items-center justify-end gap-4 p-4">
								<Nav />
								<ModeToggle />
								<SignedOut>
									<SignInButton />
									<SignUpButton />
								</SignedOut>
								<SignedIn>
									<UserButton />
								</SignedIn>
							</header>
							<div className="w-full max-w-4xl">{children}</div>
						</ThemeProvider>
					</body>
				</html>
			</TRPCProvider>
		</ClerkProvider>
	);
}
