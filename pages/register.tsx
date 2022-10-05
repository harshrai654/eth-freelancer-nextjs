import { Grid, Title, Divider, Radio, Center } from "@mantine/core";
import { useState } from "react";
import EmployeeForm from "../components/Forms/EmployeeForm";
import EmployerForm from "../components/Forms/EmployerForm";

export default function Register() {
	const [role, setRole] = useState("employee");

	return (
		<Grid justify="center" align="center">
			<Grid.Col span={6}>
				<Divider
					my="sm"
					size="xs"
					labelPosition="center"
					label={<Title>Register</Title>}
				/>
			</Grid.Col>
			<Grid.Col span={12}>
				<Center>
					<Radio.Group value={role} onChange={setRole} name="role">
						<Radio value="employee" label="Employee" />
						<Radio value="employer" label="Employer" />
					</Radio.Group>
				</Center>
			</Grid.Col>
			<Grid.Col>
				{role === "employee" ? (
					<EmployeeForm role={role} />
				) : (
					<EmployerForm role={role} />
				)}
			</Grid.Col>
		</Grid>
	);
}
