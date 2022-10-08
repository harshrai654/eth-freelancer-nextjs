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
import { useRouter } from "next/router";

export default function ProjectCard({ id }) {
	const { chainId: chainIdHex, account: clientId } = useMoralis();
	const router = useRouter();

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
				<Card
					shadow="sm"
					p="lg"
					m="xs"
					radius="md"
					withBorder
					style={{ height: "100%" }}>
					<Card.Section>
						<Image
							src="https://source.unsplash.com/random/?abstract,color"
							height={160}
							alt="Project Card"
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
						radius="md"
						onClick={() => router.push(`/projects/${id}`)}>
						View Project
					</Button>
				</Card>
			)}
		</>
	);
}
