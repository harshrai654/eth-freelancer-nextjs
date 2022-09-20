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
						serverUrl="https://vier6qc1ui3a.usemoralis.com:2053/server"
						appId="KrFRPZAax8pgSd3vkRIeQYNB8vB0pAbc8PmaUngp">
						<NotificationsProvider position="top-right">
							<AppShell
								padding="xs"
								header={
									<Header height={60} p="xs">
										<CustomHeader />
									</Header>
								}>
								<AuthRouter>
									<Component {...pageProps} />
								</AuthRouter>
							</AppShell>
						</NotificationsProvider>
					</MoralisProvider>
				</MantineProvider>
			</ColorSchemeProvider>
		</>
	);
}

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
	colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
