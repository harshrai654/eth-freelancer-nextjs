import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { AppProps } from "next/app";
import { getCookie, setCookie } from "cookies-next";
import Head from "next/head";
import {
	MantineProvider,
	ColorScheme,
	ColorSchemeProvider,
	AppShell,
	Header,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { MoralisProvider } from "react-moralis";
import CustomHeader from "../components/CustomHeader";
import AuthRouter from "../components/AuthRouter";
import ModalContextProvider from "../contexts/ModalContext";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
	const { Component, pageProps } = props;
	const [colorScheme, setColorScheme] = useState<ColorScheme>(
		props.colorScheme
	);

	const toggleColorScheme = (value?: ColorScheme) => {
		const nextColorScheme =
			value || (colorScheme === "dark" ? "light" : "dark");
		setColorScheme(nextColorScheme);
		setCookie("mantine-color-scheme", nextColorScheme, {
			maxAge: 60 * 60 * 24 * 30,
		});
	};

	return (
		<>
			<Head>
				<title>D-lancer</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<link rel="shortcut icon" href="/favicon.svg" />
			</Head>

			<ColorSchemeProvider
				colorScheme={colorScheme}
				toggleColorScheme={toggleColorScheme}>
				<MantineProvider
					theme={{ colorScheme }}
					withGlobalStyles
					withNormalizeCSS>
					<MoralisProvider
						serverUrl="https://ivpsudbvuwhw.usemoralis.com:2053/server"
						appId="QN2m4QcjmEUcr5MV4fov1elbCBI2u2faI6ySGMF5">
						<NotificationsProvider position="top-right">
							<ModalContextProvider>
								<AppShell
									padding="xs"
									header={
										<Header height={60} p="xs">
											<CustomHeader
												colorScheme={colorScheme}
												setColorScheme={setColorScheme}
											/>
										</Header>
									}>
									<AuthRouter>
										<Component {...pageProps} />
									</AuthRouter>
								</AppShell>
							</ModalContextProvider>
						</NotificationsProvider>
					</MoralisProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
	colorScheme: getCookie("mantine-color-scheme", ctx) || "dark",
});
