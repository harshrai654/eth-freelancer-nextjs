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
import { useEffect } from "react";
import {
	IconCurrencyEthereum,
	IconTrash,
	IconShieldCheck,
	IconShieldOff,
} from "@tabler/icons";
import { abi, contractAddresses, contractNames } from "../../constants";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { v4 } from "uuid";
import Moralis from "moralis-v1";
import { showNotification } from "@mantine/notifications";

export default function AddProjectForm({ setLoading }) {
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

	const total = form.values.milestones.reduce((x, y) => x + y.amount, 0);

	const { chainId: chainIdHex } = useMoralis();
	const chainId = parseInt(chainIdHex);

	const projectsContractAddress = contractAddresses[chainId]
		? contractAddresses[chainId][contractNames.PROJECTS_CONTRACT]
		: null;
	const projectsContractAbi = JSON.parse(
		abi[chainId][contractNames.PROJECTS_CONTRACT]
	);

	const {
		error,
		isFetching,
		isLoading,
		runContractFunction: addProject,
	} = useWeb3Contract({});

	async function handleAddProjectSubmit({
		title,
		description,
		milestones,
		duration,
	}) {
		const milestoneNames = milestones.map((m) => m.name);
		const milestoneRewards = milestones.map((m) =>
			Moralis.Units.ETH(m.amount.toFixed(15))
		);

		const params = {
			abi: projectsContractAbi,
			contractAddress: projectsContractAddress,
			functionName: "addProject",
			params: {
				projectTitle: title,
				projectDescription: description,
				duration,
				_checkpointNames: milestoneNames,
				_checkpointRewards: milestoneRewards,
			},
		};

		await addProject({
			params,
			onSuccess: (data) => {
				showNotification({
					id: "project-add-success",
					autoClose: 5000,
					title: "Project Created",
					message: `Project ${title} added successfully`,
					color: "green",
					icon: <IconShieldCheck />,
				});
				console.log(data);
			},
			onError: (error) => {
				showNotification({
					id: "project-add-error",
					autoClose: 5000,
					title: "Error",
					message: `Project ${title} creation failed`,
					color: "red",
					icon: <IconShieldOff />,
				});
				console.log(error);
			},
		});
	}

	useEffect(() => {
		setLoading(isLoading || isFetching);

		if (error) {
			showNotification({
				id: "project-add-error",
				autoClose: 5000,
				title: "Error",
				message: `Project creation failed`,
				color: "red",
				icon: <IconShieldOff />,
			});
			console.log(error);
		}
	}, [isLoading, isFetching, error]);

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
							step={0.0000000001}
							description="Reward value for milestone completion"
							precision={10}
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
