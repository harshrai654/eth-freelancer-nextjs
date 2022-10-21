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
	SegmentedControl,
} from "@mantine/core";
import Moralis from "moralis-v1";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	useMoralis,
	useWeb3Contract,
	useWeb3ExecuteFunction,
} from "react-moralis";
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

	const [applicant, setApplicant] = useState("");
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
			assigneeAddress: applicant,
		},
	});

	const {
		error: cancelApplyError,
		isFetching: isFetchingCancelApply,
		isLoading: isLoadingCancelApply,
		runContractFunction: cancelApplyForProject,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "cancelApplyForProject",
		params: {
			_id: id,
		},
	});

	let total = 0;

	if (Array.isArray(checkpointsData)) {
		checkpointsData[1].forEach((checkpoint) => {
			total += checkpoint.toNumber();
		});
	}

	const {
		error: assignError,
		isFetching: isFetchingAssign,
		isLoading: isLoadingAssign,
		fetch: assign,
	} = useWeb3ExecuteFunction({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "assign",
		params: {
			_id: id,
			assigneeAddress: applicant,
		},
		msgValue: total,
	});

	useEffect(() => {
		getProject();
		getCheckpointRewardsDetails();
		getProjectApplicants();
		console.log(checkpointsData);
	}, []);

	const alreadyApplied =
		applicantsData &&
		applicantsData.find(
			(id) => id.toLowerCase() === account?.toLowerCase()
		);

	const normalizedApplicantsData = Array.isArray(applicantsData)
		? applicantsData
				.filter((address) => parseInt(address, 16) !== 0)
				.map((applicant) => ({ value: applicant, label: applicant }))
		: [];

	const assignee = projectData ? parseInt(projectData[1], 16) : 0;

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
					{isEmployer &&
					Array.isArray(projectData) &&
					assignee === 0 ? (
						<Grid.Col span={4}>
							{isLoadingApplicants || isFetchingApplicants ? (
								<Loader variant="bars" />
							) : (
								<>
									{normalizedApplicantsData.length > 0 ? (
										<Stack>
											<Title order={5}>Applicants</Title>
											<Divider orientation="horizontal" />
											<SegmentedControl
												value={applicant}
												onChange={setApplicant}
												orientation="vertical"
												data={normalizedApplicantsData}
												color="green"
												radius="md"
												size="xs"
											/>
											<Button
												disabled={applicant === ""}
												onClick={async () => {
													await assign({
														onSuccess: async (
															tsx
														) => {
															await tsx.wait(1);
															await getProject();
														},
													});
												}}
												loading={
													isFetchingAssign ||
													isLoadingAssign
												}>
												Assign
											</Button>
										</Stack>
									) : (
										<Text>No Applicants</Text>
									)}
								</>
							)}
						</Grid.Col>
					) : assignee !== 0 ? (
						<Grid.Col span={4}>
							<Title order={5}>Assignee</Title>
							<Divider orientation="horizontal" />
							<Text>
								{projectData[1].toUpperCase()}
								{projectData[1].toUpperCase() ===
									account?.toUpperCase() && " (You)"}
							</Text>
						</Grid.Col>
					) : (
						<Text>No Assignee</Text>
					)}
				</Grid>

				<Divider orientation="horizontal" />
				{alreadyApplied ? (
					<Button
						color="red"
						onClick={() => {
							cancelApplyForProject({
								onSuccess: async (tsx) => {
									await tsx.wait(1);
									getProjectApplicants();
								},
							});
						}}
						disabled={
							projectData[1].toUpperCase() ===
							account.toUpperCase()
						}
						loading={isFetchingCancelApply || isLoadingCancelApply}>
						Cancel Application
					</Button>
				) : (
					<Button
						disabled={
							!applicantsData || isEmployer || alreadyApplied
						}
						onClick={() => {
							applyForProject({
								onSuccess: async (tsx) => {
									await tsx.wait(1);
									getProjectApplicants();
								},
							});
						}}
						loading={isFetchingApply || isLoadingApply}>
						Apply
					</Button>
				)}
			</Stack>
		</Container>
	);
}
