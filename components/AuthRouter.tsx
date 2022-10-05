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
		enableWeb3,
		web3,
	} = useMoralis();
	const router = useRouter();

	useEffect(() => {
		if (!isWeb3Enabled) {
			enableWeb3();
		}
	}, [web3?.provider]);

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
