import { AppShell, Header } from "@mantine/core";
import CustomHeader from "../components/CustomHeader";

export default function HomePage() {
	return (
		<AppShell
			padding="xs"
			header={
				<Header height={60} p="xs">
					<CustomHeader />
				</Header>
			}>
			App
		</AppShell>
	);
}
