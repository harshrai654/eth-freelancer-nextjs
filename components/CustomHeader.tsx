import { Grid, Title, Button, Menu, Container } from "@mantine/core";
import { IconLogout } from "@tabler/icons";
import { useMoralis } from "react-moralis";

export default function CustomHeader() {
	const { authenticate, isAuthenticated, user, logout } = useMoralis();
	return (
		<Grid justify="space-between" align="center" gutter="xl">
			<Grid.Col span={5}>
				<Title weight={600} order={1}>
					D-Lancer
				</Title>
			</Grid.Col>
			<Grid.Col span={1}>
				{!isAuthenticated ? (
					<Button onClick={authenticate}>Login</Button>
				) : (
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button>Actions</Button>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>User: {user?.getUsername()}</Menu.Label>
							<Menu.Item
								icon={<IconLogout size={18} />}
								onClick={logout}>
								Logout
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				)}
			</Grid.Col>
		</Grid>
	);
}
