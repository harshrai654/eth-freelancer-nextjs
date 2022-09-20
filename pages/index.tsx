import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";

export default function HomePage() {
	const { isAuthenticated, user } = useMoralis();
	const role = user?.get("role");
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			if (role) {
				router.replace(`/${role}`);
			} else {
				router.replace(`/register`);
			}
		}
	});

	return <div>Banner</div>;
}
