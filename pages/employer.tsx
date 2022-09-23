import AddProjectForm from "../components/Forms/AddProjectForm";
import ModalWrapper from "../components/ModalWrapper";

export default function Employer() {
	return (
		<>
			<ModalWrapper title="Add new Project">
				<AddProjectForm />
			</ModalWrapper>
		</>
	);
}
