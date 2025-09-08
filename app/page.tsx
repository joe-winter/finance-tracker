import Link from "next/link";
import { Button } from "./components/ui/button";

export default async function Page() {
	return (
		<div className="-mt-16 flex min-h-screen flex-col items-center justify-center">
			<div className="flex gap-4">
				<Button asChild>
					<Link href="/sign-in">Sign In</Link>
				</Button>
				<Button asChild variant="outline">
					<Link href="/sign-up">Sign Up</Link>
				</Button>
			</div>
		</div>
	);
}
