import {
	TextInput,
	NumberInput,
	Button,
	Group,
	Textarea,
	Stack,
	ActionIcon,
	Divider,
	Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCurrencyEthereum, IconTrash } from "@tabler/icons";
import { v4 } from "uuid";

export default function AddProjectForm() {
	const form = useForm({
		initialValues: {
			title: "",
			description: "",
			duration: 0,
			milestones: [
				{
					name: "",
					amount: 0,
					key: v4(),
				},
			],
		},

		validate: {
			title: (value) =>
				value.length > 3 ? null : "Enter a more descriptive title",
			milestones: (value) =>
				value.length > 0 ? null : "Atleast 1 milestone required",
		},
	});

	function handleAddProjectSubmit(formValues) {
		console.log(formValues);
	}

	const total = form.values.milestones.reduce((x, y) => x + y.amount, 0);
	console.log(total);

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
				{...form.getInputProps("title")}
			/>

			<Textarea
				placeholder="Enter Project Description"
				label="Project Description"
				withAsterisk
				required
				radius="md"
				{...form.getInputProps("description")}
			/>

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
			<br />

			<Stack align="flex-start">
				{form.values.milestones.map((milestone, index) => (
					<Group align="end" spacing="xs" key={milestone.key}>
						<TextInput
							withAsterisk
							label="Milestone"
							radius="md"
							description="About Milestone"
							required
							{...form.getInputProps(`milestones.${index}.name`)}
						/>
						<NumberInput
							label="Milestone Reward"
							radius="md"
							step={0.0000001}
							description="Reward value for milestone completion"
							precision={7}
							required
							min={0}
							icon={<IconCurrencyEthereum size={18} />}
							withAsterisk
							{...form.getInputProps(
								`milestones.${index}.amount`
							)}
						/>
						{form.values.milestones.length > 1 && (
							<ActionIcon
								variant="subtle"
								color="red"
								onClick={() => {
									let currentMilestones =
										form.values.milestones;

									currentMilestones.splice(index, 1);
									form.setFieldValue(
										"milestones",
										currentMilestones
									);
								}}>
								<IconTrash size={20} />
							</ActionIcon>
						)}
					</Group>
				))}
				<Divider size="xs" />
				<Text size="lg" weight="bold" align="center">
					Total: {total}
				</Text>
			</Stack>

			<Group position="right" mt="md">
				<Button
					onClick={() => {
						form.setFieldValue("milestones", [
							...form.values.milestones,
							{ name: "", amount: 0, key: v4() },
						]);
					}}>
					Add Milestone
				</Button>
				<Button type="submit">Submit</Button>
			</Group>
		</form>
	);
}
