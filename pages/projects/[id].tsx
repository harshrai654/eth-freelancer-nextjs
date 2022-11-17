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
	Group,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconShieldCheck, IconShieldOff } from "@tabler/icons";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	useMoralis,
	useWeb3Contract,
	useWeb3ExecuteFunction,
} from "react-moralis";
import SubmitWorkForm from "../../components/Forms/SubmitWorkForm";
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
		fetch: getProject,
	} = useWeb3ExecuteFunction({
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
		fetch: getCheckpointRewardsDetails,
	} = useWeb3ExecuteFunction({
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
		fetch: getProjectApplicants,
	} = useWeb3ExecuteFunction({
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
		fetch: applyForProject,
	} = useWeb3ExecuteFunction({
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
		fetch: cancelApplyForProject,
	} = useWeb3ExecuteFunction({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "cancelApplyForProject",
		params: {
			_id: id,
		},
	});

	const {
		error: unassignError,
		isFetching: isFetchingUnassign,
		isLoading: isLoadingUnassign,
		fetch: unassign,
	} = useWeb3ExecuteFunction({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "unassign",
		params: {
			_id: id,
		},
	});

	let total = BigInt(0);

	if (Array.isArray(checkpointsData)) {
		checkpointsData[1].forEach((checkpoint, index) => {
			total += checkpointsData[2][index]
				? BigInt(0)
				: BigInt(checkpoint.toString());
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
		msgValue: total.toString(),
	});

	const {
		isFetching: isFetchingCheckpointComplete,
		isLoading: isLoadingCheckpointComplete,
		fetch: checkpointCompleted,
	} = useWeb3ExecuteFunction({});

	function handleCheckpointCompleted(index) {
		const params = {
			abi: projectsContractAbi,
			contractAddress: projectsContractAddress,
			functionName: "checkpointCompleted",
			params: {
				_id: id,
				index,
			},
		};

		checkpointCompleted({
			params,
			onSuccess: async (tx) => {
				await tx.wait(6);
				showNotification({
					id: "checkpoint-verify-success",
					autoClose: 5000,
					title: "Transaction successful",
					message: `Checkpoint Completed, Reward transferred`,
					color: "green",
					icon: <IconShieldCheck />,
				});
				getCheckpointRewardsDetails();
			},
			onError: (error) => {
				showNotification({
					id: "checkpoint-verify-fail",
					autoClose: 5000,
					title: "Transaction failed",
					message: `Reward transfer failed`,
					color: "red",
					icon: <IconShieldOff />,
				});
				console.log(error);
			},
		});
	}

	useEffect(() => {
		getProject();
		getCheckpointRewardsDetails();
		getProjectApplicants();
		console.log(checkpointsData);
		console.log(projectData);
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

	let pendingCheckpointVerification =
		Array.isArray(checkpointsData) &&
		checkpointsData.length > 0 &&
		checkpointsData[3].some((checkpoint, index) => {
			return checkpoint !== "" && checkpointsData[2][index] === false;
		});

	console.log(checkpointsData);
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
												].toString()}
											</td>
											<td>
												{checkpointsData[2][index] ? (
													<Badge
														color="green"
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
											{!isEmployer ? (
												<td>
													{!checkpointsData[2][
														index
													] &&
														projectData[1].toUpperCase() ===
															account?.toUpperCase() && (
															<SubmitWorkForm
																title={name}
																id={id}
																index={index}
																getCheckpointRewardsDetails={
																	getCheckpointRewardsDetails
																}
																currentText={
																	checkpointsData[3][
																		index
																	]
																}
															/>
														)}
												</td>
											) : (
												<td>
													{checkpointsData[3][
														index
													] !== "" &&
														!checkpointsData[2][
															index
														] && (
															<Group>
																<Text variant="link">
																	{
																		checkpointsData[3][
																			index
																		]
																	}
																</Text>
																<Button
																	variant="filled"
																	color={
																		"pink"
																	}
																	radius="lg"
																	onClick={() =>
																		handleCheckpointCompleted(
																			index
																		)
																	}>
																	Verify Work
																</Button>
																<br />
															</Group>
														)}
												</td>
											)}
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
															await tsx.wait(6);
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
				<Grid>
					<Grid.Col>
						{alreadyApplied ? (
							<Button
								color="red"
								onClick={() => {
									cancelApplyForProject({
										onSuccess: async (tsx) => {
											await tsx.wait(6);
											getProjectApplicants();
										},
									});
								}}
								disabled={
									!projectData ||
									projectData[1].toUpperCase() ===
										account.toUpperCase()
								}
								loading={
									isFetchingCancelApply ||
									isLoadingCancelApply
								}>
								Cancel Application
							</Button>
						) : (
							<Button
								disabled={
									!applicantsData ||
									isEmployer ||
									alreadyApplied
								}
								onClick={() => {
									applyForProject({
										onSuccess: async (tsx) => {
											await tsx.wait(6);
											getProjectApplicants();
										},
									});
								}}
								loading={isFetchingApply || isLoadingApply}>
								Apply
							</Button>
						)}
					</Grid.Col>
					<Grid.Col>
						{isEmployer &&
							!pendingCheckpointVerification &&
							assignee !== 0 && (
								<Button
									onClick={() => {
										unassign({
											onSuccess: async (tx) => {
												await tx.wait(6);
												showNotification({
													id: "unassign-success",
													autoClose: 5000,
													title: "Unassign Success",
													message: `Successfully unassigned ${projectData[1]}`,
													color: "green",
													icon: <IconShieldCheck />,
												});
												getProject();
											},
											onError: (error) => {
												showNotification({
													id: "unassign-fail",
													autoClose: 5000,
													title: "Unable to unassign",
													message: `Unable to unassign ${projectData[1]}`,
													color: "red",
													icon: <IconShieldOff />,
												});
												console.log(error);
											},
										});
									}}>
									Un-assign
								</Button>
							)}
					</Grid.Col>
				</Grid>
			</Stack>
		</Container>
	);
}
