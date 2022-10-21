import { LoadingOverlay } from "@mantine/core";
import { useContext } from "react";
import ClientProjects from "../components/ClientProjects";
import { LoadingContext } from "../contexts/LoadingContext";

export default function Employer() {
	const { loading } = useContext(LoadingContext);
	return (
		<>
			<LoadingOverlay visible={loading} />
			<ClientProjects />
		</>
	);
}
