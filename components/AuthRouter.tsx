import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingOverlay } from "@mantine/core";

export default function AuthRouter({ children }) {
	const {
		isAuthenticated,
		user,
		isAuthenticating,
		isLoggingOut,
		isUserUpdating,
		isWeb3EnableLoading,
		isWeb3Enabled,
	} = useMoralis();
	const router = useRouter();

	useEffect(() => {
		if (!isAuthenticated) {
			router.replace("/");
		} else {
			const role = user?.get("role");

			if (role === "employee" || role === "employer") {
				router.replace(`/${role}`);
			} else {
				router.replace("/register");
			}
		}
	}, [isAuthenticated]);

	const loaderVisible =
		isAuthenticating ||
		isLoggingOut ||
		isUserUpdating ||
		isWeb3EnableLoading;

	return (
		<>
			<LoadingOverlay visible={loaderVisible} />
			{isWeb3Enabled && children}
		</>
	);
}
