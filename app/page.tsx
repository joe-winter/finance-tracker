import { SignIn } from "@clerk/nextjs";

export default async function Page() {
	return (
		<div className="-mt-16 flex min-h-screen flex-col items-center justify-center">
			<SignIn fallbackRedirectUrl={"/dashboard"} />
		</div>
	);
}
