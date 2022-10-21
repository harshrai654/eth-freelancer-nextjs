import { useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddresses, contractNames } from "../constants";
import { Grid, LoadingOverlay } from "@mantine/core";
import { ModalContext } from "../contexts/ModalContext";
import { useContext } from "react";
import ProjectCard from "./ProjectCard";

export default function ClientProjects() {
	const { chainId: chainIdHex, account: clientId } = useMoralis();
	const { open } = useContext(ModalContext);

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
	}, [open]);

	return (
		<>
			<LoadingOverlay visible={isFetching || isLoading} />
			{Array.isArray(data) && (
				<Grid gutter="lg" p={12} justify="center" align="center">
					{data.map((projectId) => (
						<ProjectCard id={projectId.toString()} />
					))}
				</Grid>
			)}
		</>
	);
}
