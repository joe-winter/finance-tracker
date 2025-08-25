import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { shadcn } from "@clerk/themes";
import TRPCProvider from "@/app/_trpc/Provider";
import { BottomNav } from "./components/bottom-nav";
import { Nav } from "./components/nav";
import { ThemeProvider } from "./components/theme-provider";

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
	description: "Finance tracker created with Next JS",
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
							<header className="flex h-16 w-full max-w-6xl items-center justify-end gap-4 p-4">
								<Nav />
							</header>
							<div className="w-full max-w-5xl">{children}</div>
							<BottomNav />
						</ThemeProvider>
					</body>
				</html>
			</TRPCProvider>
		</ClerkProvider>
	);
}
