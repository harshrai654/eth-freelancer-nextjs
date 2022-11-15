import { Grid, Title, Button, Menu } from "@mantine/core";
import {
	IconLogout,
	IconShieldCheck,
	IconPlus,
	IconSun,
	IconMoon,
} from "@tabler/icons";
import { useContext, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { showNotification } from "@mantine/notifications";
import { ModalContext } from "../contexts/ModalContext";
import AddProjectForm from "../components/Forms/AddProjectForm";
import ModalWrapper from "../components/ModalWrapper";
import { LoadingContext } from "../contexts/LoadingContext";
import Moralis from "moralis-v1";

export default function CustomHeader({ colorScheme, setColorScheme }) {
	const {
		authenticate,
		isAuthenticated,
		user,
		logout,
		isAuthenticating,
		enableWeb3,
		web3,
		isWeb3Enabled,
		chainId,
		account,
	} = useMoralis();
	const { setOpen } = useContext(ModalContext);
	const { loading, setLoading } = useContext(LoadingContext);
	const role = user?.get("role");

	console.log(account, chainId);

	useEffect(() => {
		if (!isWeb3Enabled) {
			enableWeb3();
		}
	}, [web3?.provider]);

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
						onClick={async () => {
							console.log(account, chainId);
							const { message } = await Moralis.Cloud.run(
								"requestMessage",
								{
									address: account,
									chain: parseInt(chainId, 16),
									network: "evm",
								}
							);
							authenticate({
								signingMessage: message,
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
								onError: (error) => {
									console.log(error);
								},
							});
						}}>
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
			<ModalWrapper title="Add new Project" loading={loading}>
				<AddProjectForm setLoading={setLoading} />
			</ModalWrapper>
		</Grid>
	);
}
