import {
	TextInput,
	Button,
	Group,
	Box,
	Notification,
	Text,
	Avatar,
	Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMoralis } from "react-moralis";
import { IconX, IconShieldCheck } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";
import utils from "../../utils";

export default function RegisterForm({ children }) {
	const [image, setImage] = useState([]);
	const { setUserData, userError, isUserUpdating, user } = useMoralis();
	const imageUrl = image.length > 0 ? URL.createObjectURL(image[0]) : "";

	const form = useForm({
		initialValues: {
			name: "",
			role: "employee",
		},

		validate: {
			name: (value) =>
				value.length > 3
					? null
					: "Name should contain more than 3 characters",
		},
	});

	function submitUserdata(formData) {
		const imageHash =
			image.length > 0
				? utils.uploadImage(image[0], user?.getUsername())
				: "";
		// setUserData({ ...formData, imageHash });
		showNotification({
			id: "register success",
			autoClose: 5000,
			title: "Registration successful!",
			message: `Welcome ${user?.get("name")}`,
			color: "green",
			icon: <IconShieldCheck />,
		});
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
						<Dropzone
							maxFiles={1}
							accept={IMAGE_MIME_TYPE}
							onDrop={setImage}>
							<Text align="center">
								Drop Your Profile Picture
							</Text>
						</Dropzone>
						<br />

						<Grid gutter="lg">
							<Grid.Col span={3}>
								<Avatar
									src={imageUrl}
									size="xl"
									imageProps={{
										onLoad: () =>
											URL.revokeObjectURL(imageUrl),
									}}
								/>
							</Grid.Col>
							<Grid.Col span={9}>
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
