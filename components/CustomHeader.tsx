import { Grid, Title, Button, Menu } from "@mantine/core";
import {
	IconLogout,
	IconShieldCheck,
	IconPlus,
	IconSun,
	IconMoon,
} from "@tabler/icons";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { useContext } from "react";
import { ModalContext } from "../contexts/ModalContext";

export default function CustomHeader({ colorScheme, setColorScheme }) {
	const { authenticate, isAuthenticated, user, logout, isAuthenticating } =
		useMoralis();
	const { setOpen } = useContext(ModalContext);
	const role = user?.get("role");

	return (
		<Grid justify="space-between" align="center" gutter="xl">
			<Grid.Col span={4}>
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
								{user?.get("name")}: {user?.getUsername()} [
								{user?.get("role")}]
							</Menu.Label>
							{role === "employer" && (
								<Menu.Item
									icon={<IconPlus size={18} />}
									onClick={() => setOpen(true)}>
									Add New Project
								</Menu.Item>
							)}
							<Menu.Item
								icon={<IconLogout size={18} />}
								onClick={() => {
									logout();
								}}>
								Logout
							</Menu.Item>
							<Menu.Item
								icon={
									colorScheme === "dark" ? (
										<IconSun />
									) : (
										<IconMoon />
									)
								}
								onClick={() =>
									setColorScheme(
										colorScheme === "dark"
											? "light"
											: "dark"
									)
								}>
								Toggle Theme
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
			</Grid.Col>
		</Grid>
	);
}
