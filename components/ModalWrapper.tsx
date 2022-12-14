import { Modal, Title, Divider } from "@mantine/core";
import { ModalContext } from "../contexts/ModalContext";
import { useContext } from "react";

export default function ModalWrapper({ children, title, loading }) {
	const { open, setOpen } = useContext(ModalContext);
	return (
		<Modal
			closeOnClickOutside={!loading}
			closeOnEscape={!loading}
			padding="xl"
			opened={open}
			onClose={() => setOpen(false)}
			title={
				<>
					<Title>{title}</Title>
					<Divider variant="dashed" />
				</>
			}
			size="xl"
			radius="lg"
			overlayOpacity={0.8}
			overlayBlur={5}>
			{children}
		</Modal>
	);
}
