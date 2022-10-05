import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../constants";
import {
	LoadingOverlay,
	Card,
	Image,
	Text,
	Badge,
	Button,
	Group,
} from "@mantine/core";

export default function ProjectCard({ id }) {
	const { chainId: chainIdHex, account: clientId } = useMoralis();

	const chainId = parseInt(chainIdHex);

	const projectsContractAddress = contractAddresses[chainId]
		? contractAddresses[chainId][contractNames.PROJECTS_CONTRACT]
		: null;
	const projectsContractAbi = JSON.parse(
		abi[chainId][contractNames.PROJECTS_CONTRACT]
	);

	const {
		data,
		error,
		isFetching,
		isLoading,
		runContractFunction: getProject,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getProject",
		params: {
			_id: id,
		},
	});

	useEffect(() => {
		getProject();
		console.log(data);
	}, []);
	return (
		<>
			<LoadingOverlay visible={isFetching || isLoading} />
			{Array.isArray(data) && (
				<Card shadow="sm" p="lg" radius="md" withBorder>
					<Card.Section>
						<Image
							src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
							height={160}
							alt="Norway"
						/>
					</Card.Section>

					<Group position="apart" mt="md" mb="xs">
						<Text weight={500}>{data[2]}</Text>
						{parseInt(data[1]) === 0 ? (
							<Badge color="green" variant="light">
								Un-Assigned
							</Badge>
						) : (
							<Badge color="lime" variant="light">
								Assigned
							</Badge>
						)}
					</Group>

					<Text size="sm" color="dimmed">
						{data[3]}
					</Text>

					<Button
						variant="light"
						color="blue"
						fullWidth
						mt="md"
						radius="md">
						Book classic tour now
					</Button>
				</Card>
			)}
		</>
	);
}
