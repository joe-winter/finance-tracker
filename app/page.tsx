import Link from "next/link";

export default async function Page() {
	return (
		<div className="-mt-16 flex min-h-screen flex-col items-center justify-center">
			<h1 className="mb-8 font-bold text-4xl">Posts</h1>
			<Link
				href="/posts/create"
				className="inline-block rounded-lg border-2 border-current px-4 py-2 text-current transition-all hover:scale-[0.98]"
			>
				Create New Post
			</Link>
		</div>
	);
}
