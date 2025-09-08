import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { shadcn } from "@clerk/themes";
import TRPCProvider from "@/app/_trpc/Provider";
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
						className={`${geistSans.variable} ${geistMono.variable} flex h-dvh flex-col items-center antialiased`}
					>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{children}
						</ThemeProvider>
					</body>
				</html>
			</TRPCProvider>
		</ClerkProvider>
	);
}
