import {
	TextInput,
	Button,
	Group,
	Box,
	Notification,
	Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMoralis } from "react-moralis";
import { IconX, IconShieldCheck } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";

export default function RegisterForm({ children, role }) {
	const { setUserData, userError, isUserUpdating, user } = useMoralis();
	const router = useRouter();

	const form = useForm({
		initialValues: {
			name: "",
			role,
		},

		validate: {
			name: (value) =>
				value.length > 3
					? null
					: "Name should contain more than 3 characters",
		},
	});

	async function submitUserdata(formData) {
		setUserData(formData);

		showNotification({
			id: "register success",
			autoClose: 5000,
			title: "Registration successful!",
			message: `Welcome ${user?.get("name")}`,
			color: "green",
			icon: <IconShieldCheck />,
		});

		router.replace(`/${role}`);
	}

	return (
		<>
			{userError ? (
				<Notification icon={<IconX size={18} />} color="red">
					{userError.message}
				</Notification>
			) : (
				<Box sx={{ maxWidth: 400 }} mx="auto">
					<form
						onSubmit={form.onSubmit((values) =>
							submitUserdata(values)
						)}>
						<br />

						<Grid gutter="lg">
							<Grid.Col span={12}>
								<TextInput
									withAsterisk
									label="Name"
									placeholder="User name"
									{...form.getInputProps("name")}
								/>
							</Grid.Col>
						</Grid>

						{children}
						<Group position="center" mt="md">
							<Button type="submit" loading={isUserUpdating}>
								Submit
							</Button>
						</Group>
					</form>
				</Box>
			)}
		</>
	);
}
