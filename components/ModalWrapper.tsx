import { Modal } from "@mantine/core";
import { ModalContext } from "../contexts/ModalContext";
import { useContext } from "react";

export default function ModalWrapper({ children, title }) {
	const { open, setOpen } = useContext(ModalContext);
	return (
		<Modal
			opened={open}
			onClose={() => setOpen(false)}
			title={title}
			fullScreen>
			{children}
		</Modal>
	);
}
