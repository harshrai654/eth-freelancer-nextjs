import {
	TextInput,
	NumberInput,
	Button,
	Group,
	Textarea,
	SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrencyEthereum } from "@tabler/icons";

export default function AddProjectForm() {
	const form = useForm({
		initialValues: {
			title: "",
			description: "",
			duration: 0,
			budget: 0,
		},

		validate: {
			title: (value) =>
				value.length > 3 ? null : "Enter a more descriptive title",
		},
	});

	function handleAddProjectSubmit(formValues) {
		console.log(formValues);
	}

	return (
		<form
			onSubmit={form.onSubmit((values) =>
				handleAddProjectSubmit(values)
			)}>
			<TextInput
				withAsterisk
				label="Project Title"
				radius="md"
				required
				{...form.getInputProps("email")}
			/>

			<Textarea
				placeholder="Enter Project Description"
				label="Project Description"
				withAsterisk
				required
				radius="md"
				{...form.getInputProps("description")}
			/>
			<SimpleGrid cols={2}>
				<NumberInput
					placeholder="Duration"
					label="Project Duration (Days)"
					description="Expected number of days to complete the project"
					radius="md"
					withAsterisk
					required
					min={1}
					{...form.getInputProps("duration")}
				/>
				<NumberInput
					placeholder="Budget"
					label="Project Budget"
					radius="md"
					step={0.0000001}
					description="Expected Total Budget allocated"
					precision={7}
					required
					min={0}
					icon={<IconCurrencyEthereum size={18} />}
					withAsterisk
					{...form.getInputProps("budget")}
				/>
			</SimpleGrid>

			<Group position="right" mt="md">
				<Button type="submit">Submit</Button>
			</Group>
		</form>
	);
}
