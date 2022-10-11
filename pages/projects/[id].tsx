import {
	Container,
	Loader,
	Stack,
	Title,
	Text,
	Table,
	Badge,
	Grid,
	Divider,
	Card,
	Button,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../../constants";

export default function Project() {
	const router = useRouter();
	const { id } = router.query;

	const { chainId: chainIdHex, user, account } = useMoralis();
	const isEmployer = user?.get("role") === "employer";
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

	const {
		data: applicantsData,
		error: applicantsError,
		isFetching: isFetchingApplicants,
		isLoading: isLoadingApplicants,
		runContractFunction: getProjectApplicants,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getProjectApplicants",
		params: {
			_id: id,
		},
	});

	const {
		error: applyError,
		isFetching: isFetchingApply,
		isLoading: isLoadingApply,
		runContractFunction: applyForProject,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "applyForProject",
		params: {
			_id: id,
		},
	});

	useEffect(() => {
		getProject();
		getCheckpointRewardsDetails();
		getProjectApplicants();
		console.log(projectData);
		console.log(checkpointsData);
		console.log(applicantsData, account);
	}, []);

	const alreadyApplied =
		applicantsData &&
		applicantsData.find(
			(id) => id.toLowerCase() === account?.toLowerCase()
		);

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
						<Card shadow="sm" p="lg" radius="md" withBorder>
							<Text color="dimmed">{projectData[3]}</Text>
						</Card>
					</>
				)}
				<Grid gutter="xl" justify="space-between" align="flex-start">
					<Grid.Col span={7}>
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
												{checkpointsData[1][
													index
												].toNumber()}
											</td>
											<td>
												{checkpointsData[2][index] ? (
													<Badge
														color="red"
														variant="dot">
														Completed
													</Badge>
												) : (
													<Badge
														color="red"
														variant="dot">
														Pending
													</Badge>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					</Grid.Col>
					<Grid.Col span={1}>
						<Divider orientation="vertical" />
					</Grid.Col>
					{isEmployer && (
						<Grid.Col span={4}>
							{isLoadingApplicants ||
							isFetchingApplicants ||
							!Array.isArray(applicantsData) ? (
								<Loader variant="bars" />
							) : (
								<Table>
									<thead>
										<tr>
											<th>Applicants</th>
											<th>Assign</th>
										</tr>
									</thead>
									<tbody>
										{applicantsData.map((address) => (
											<tr key={address}>
												<td>{address}</td>
												<td>Assign</td>
											</tr>
										))}
									</tbody>
								</Table>
							)}
						</Grid.Col>
					)}
				</Grid>

				<Divider orientation="horizontal" />

				<Button
					disabled={!applicantsData || isEmployer || alreadyApplied}
					onClick={() => {
						applyForProject();
						getProjectApplicants();
					}}
					loading={isFetchingApply || isLoadingApply}>
					{alreadyApplied ? "Already Applied" : "Apply"}
				</Button>
			</Stack>
		</Container>
	);
}
