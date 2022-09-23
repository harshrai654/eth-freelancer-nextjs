import { TextInput, Checkbox, Button, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function AddProjectForm() {
	const form = useForm({
		initialValues: {
			title: "",
			termsOfService: false,
		},

		validate: {
			title: (value) =>
				value.length > 3 ? null : "Enter a more descriptive title",
		},
	});
	return (
		<form onSubmit={form.onSubmit((values) => console.log(values))}>
			<TextInput
				withAsterisk
				label="Project Title"
				{...form.getInputProps("email")}
			/>

			<Checkbox
				mt="md"
				label="I agree to sell my privacy"
				{...form.getInputProps("termsOfService", { type: "checkbox" })}
			/>

			<Group position="right" mt="md">
				<Button type="submit">Submit</Button>
			</Group>
		</form>
	);
}
