import {
	Container,
	Loader,
	Stack,
	Title,
	Text,
	Table,
	Badge,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../../constants";

export default function Project() {
	const router = useRouter();
	const { id } = router.query;

	const { chainId: chainIdHex, account: clientId } = useMoralis();

	const chainId = parseInt(chainIdHex);

	const projectsContractAddress = contractAddresses[chainId]
		? contractAddresses[chainId][contractNames.PROJECTS_CONTRACT]
		: null;
	const projectsContractAbi = JSON.parse(
		abi[chainId][contractNames.PROJECTS_CONTRACT]
	);

	const {
		data: projectData,
		error: projectError,
		isFetching: isFetchingProject,
		isLoading: isLoadingProject,
		runContractFunction: getProject,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getProject",
		params: {
			_id: id,
		},
	});

	const {
		data: checkpointsData,
		error: checkpointsError,
		isFetching: isFetchingCheckpoints,
		isLoading: isLoadingCheckpoints,
		runContractFunction: getCheckpointRewardsDetails,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getCheckpointRewardsDetails",
		params: {
			_id: id,
		},
	});

	useEffect(() => {
		getProject();
		getCheckpointRewardsDetails();
		console.log(projectData);
		console.log(checkpointsData);
	}, []);

	return (
		<Container fluid m="sm">
			<Stack align="flex-start">
				{isLoadingProject ||
				isFetchingProject ||
				!Array.isArray(projectData) ? (
					<Loader variant="bars" />
				) : (
					<>
						<Title>{projectData[2]}</Title>
						<Text weight="lighter" size="sm">
							Created At{" : "}
							{new Date(
								projectData[4].toNumber() * 1000
							).toLocaleDateString()}
						</Text>
						<Text color="dimmed">{projectData[3]}</Text>
					</>
				)}

				{isLoadingCheckpoints ||
				isFetchingCheckpoints ||
				!Array.isArray(checkpointsData) ? (
					<Loader variant="bars" />
				) : (
					<Table>
						<thead>
							<tr>
								<th>Milestone</th>
								<th>Reward Value</th>
								<th>Status</th>
							</tr>
						</thead>
						<tbody>
							{checkpointsData[0].map((name, index) => (
								<tr key={name}>
									<td>{name}</td>
									<td>
										{checkpointsData[1][index].toNumber()}
									</td>
									<td>
										{checkpointsData[2][index] ? (
											<Badge color="red" variant="dot">
												Completed
											</Badge>
										) : (
											<Badge color="red" variant="dot">
												Pending
											</Badge>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</Stack>
		</Container>
	);
}
