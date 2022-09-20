import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";

export default function AuthRouter({ children }) {
	const {
		isAuthenticated,
		isUnauthenticated,
		user,
		isAuthenticating,
		isLoggingOut,
		isUserUpdating,
		isWeb3EnableLoading,
	} = useMoralis();
	const router = useRouter();

	useEffect(() => {
		if (isUnauthenticated) {
			router.replace("/");
		} else if (isAuthenticated) {
			const role = user?.get("role");

			if (role === "employee" || role === "employer") {
				router.replace(`/${role}`);
			} else {
				router.replace("/register");
			}
		}
	});

	return (
		<>
			<LoadingOverlay
				visible={
					isAuthenticating ||
					isLoggingOut ||
					isUserUpdating ||
					isWeb3EnableLoading
				}
			/>
			{children}
		</>
	);
}
