import { useState } from "react";
import { Modal, TextInput, Button, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconFileReport } from "@tabler/icons";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../../constants";

export default function SubmitWorkForm({
	title,
	index,
	id,
	getCheckpointRewardsDetails,
	currentText,
}) {
	const form = useForm({
		initialValues: {
			text: "",
		},

		validate: {
			text: (value) =>
				value.length === 0 ? "Link cannot be empty" : null,
		},
	});

	const [open, setOpen] = useState(false);
	const { chainId: chainIdHex, user, account } = useMoralis();
	const chainId = parseInt(chainIdHex);

	const projectsContractAddress = contractAddresses[chainId]
		? contractAddresses[chainId][contractNames.PROJECTS_CONTRACT]
		: null;
	const projectsContractAbi = JSON.parse(
		abi[chainId][contractNames.PROJECTS_CONTRACT]
	);

	const {
		error,
		isFetching: isFetchingCheckpointLinks,
		isLoading: isLoadingCheckpointLinks,
		runContractFunction: setCheckpointLink,
	} = useWeb3Contract({});

	console.log(error);

	function submitWork({ text }) {
		const params = {
			abi: projectsContractAbi,
			contractAddress: projectsContractAddress,
			functionName: "setCheckpointLink",
			params: {
				_id: id,
				_checkpointIndex: index,
				_link: text,
			},
		};

		setCheckpointLink({
			params,
			onSuccess: async (tx) => {
				await tx.wait(1);
				getCheckpointRewardsDetails();
			},
		});
	}

	return (
		<>
			<Button
				variant="outline"
				color="teal"
				radius="lg"
				onClick={() => setOpen(true)}
				loading={isFetchingCheckpointLinks || isLoadingCheckpointLinks}>
				{currentText !== "" ? "Modify work" : "Submit work"}
			</Button>
			<Modal opened={open} onClose={() => setOpen(false)} title={title}>
				<form
					onSubmit={form.onSubmit((values) => {
						submitWork(values);
					})}>
					<TextInput
						placeholder={currentText || "Shareable work link"}
						defaultValue={currentText}
						label="Link"
						description="Link to work/code "
						radius="md"
						withAsterisk
						required
						name="text"
						{...form.getInputProps("text")}
					/>
					<br />
					<Divider orientation="horizontal" />
					<br />
					<Button
						leftIcon={<IconFileReport />}
						variant="white"
						type="submit">
						Send for approval
					</Button>
				</form>
			</Modal>
		</>
	);
}
