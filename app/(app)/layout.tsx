import { BottomNav } from "../components/bottom-nav";
import { Nav } from "../components/nav";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<header className="flex h-16 w-full max-w-6xl items-center justify-end gap-4 p-4">
				<Nav />
			</header>
			<div className="mb-20 w-full max-w-5xl">{children}</div>
			<BottomNav />
		</>
	);
}
