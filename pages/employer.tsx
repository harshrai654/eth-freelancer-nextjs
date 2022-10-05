import { LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import AddProjectForm from "../components/Forms/AddProjectForm";
import ModalWrapper from "../components/ModalWrapper";
import ClientProjects from "../components/ClientProjects";

export default function Employer() {
	const [loading, setLoading] = useState<Boolean>(false);
	return (
		<>
			<LoadingOverlay visible={loading} />
			<ModalWrapper title="Add new Project" loading={loading}>
				<AddProjectForm setLoading={setLoading} />
			</ModalWrapper>
			<ClientProjects setLoading={setLoading} />
		</>
	);
}
