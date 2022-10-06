import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../constants";
import { Grid, LoadingOverlay, SimpleGrid } from "@mantine/core";
import ProjectCard from "./ProjectCard";

export default function ClientProjects() {
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
		runContractFunction: getClientProjects,
	} = useWeb3Contract({
		abi: projectsContractAbi,
		contractAddress: projectsContractAddress,
		functionName: "getClientProjects",
		params: {
			_clientAddress: clientId,
		},
	});

	useEffect(() => {
		(async () => {
			await getClientProjects();
		})();
		if (error) {
			console.log(error);
		}
		console.log(data);
	}, []);

	return (
		<>
			<LoadingOverlay visible={isFetching || isLoading} />
			{Array.isArray(data) && (
				<SimpleGrid cols={5} p={12}>
					{data.map((projectId) => (
						<ProjectCard id={projectId.toString()} />
					))}
				</SimpleGrid>
			)}
		</>
	);
}