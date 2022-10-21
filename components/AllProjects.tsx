import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../constants";
import {
	Grid,
	LoadingOverlay,
	Switch,
	Container,
	Center,
	Divider,
} from "@mantine/core";
import ProjectCard from "./ProjectCard";

export default function AllProjects() {
	const { chainId: chainIdHex } = useMoralis();
	const [ownProjects, setOwnProjects] = useState(false);

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
		runContractFunction: getAllProjects,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getAllProjects",
		params: {},
	});

	useEffect(() => {
		(async () => {
			await getAllProjects();
		})();
		if (error) {
			console.log(error);
		}
		console.log(data);
	}, []);

	return (
		<Container fluid>
			<LoadingOverlay visible={isFetching || isLoading} />
			<Center>
				<Switch
					label="Show my projects only"
					size="md"
					checked={ownProjects}
					onChange={(event) =>
						setOwnProjects(event.currentTarget.checked)
					}
				/>
				<Divider orientation="horizontal" />
			</Center>
			{Array.isArray(data) && (
				<Grid gutter="lg" p={12} justify="center" align="center">
					{data.map((projectId) => (
						<ProjectCard
							id={projectId.toString()}
							ownProjects={ownProjects}
						/>
					))}
				</Grid>
			)}
		</Container>
	);
}
