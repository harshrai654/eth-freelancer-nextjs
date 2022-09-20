import { Grid, Title, Button, Menu, Container } from "@mantine/core";
import { IconLogout, IconShieldCheck } from "@tabler/icons";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";

export default function CustomHeader() {
	const { authenticate, isAuthenticated, user, logout, isAuthenticating } =
		useMoralis();

	return (
		<Grid justify="space-between" align="center" gutter="xl">
			<Grid.Col span={5}>
				<Title weight={600} order={1}>
					D-Lancer
				</Title>
			</Grid.Col>
			<Grid.Col span={1}>
				{!isAuthenticated ? (
					<Button
						onClick={() =>
							authenticate({
								onSuccess: () =>
									showNotification({
										id: "sign-in success",
										autoClose: 5000,
										title: "Log-in successful!",
										message:
											"Wallet Authentication successful",
										color: "green",
										icon: <IconShieldCheck />,
									}),
							})
						}>
						Login
					</Button>
				) : (
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button disabled={isAuthenticating}>Actions</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>
								{user?.get("name")}: {user?.getUsername()}
							</Menu.Label>
							<Menu.Item
								icon={<IconLogout size={18} />}
								onClick={() => {
									logout();
								}}>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
			</Grid.Col>
		</Grid>
	);
}
