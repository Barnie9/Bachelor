import { useNavigate } from "react-router-dom";
import { useGetTeamsQuery } from "../redux/serverApi";

export const Teams = () => {
	const navigate = useNavigate();

	const { data: teams, isSuccess: isTeamsSuccess } = useGetTeamsQuery();

	const onTeamClick = (teamId: string) => {
		navigate(`/team/${teamId}`);
	};

	const onEmployeeClick = (employeeId: string) => {
		navigate(`/employee/${employeeId}`);
	};

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				gap: "20px",
				padding: "20px",
				height: "calc(100% - 40px)",
				width: "calc(100% - 40px)",
			}}
		>
			{isTeamsSuccess &&
				teams.map((team) => (
					<div
						key={team.id + "-team"}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: "20px",
							height: "300px",
							width: "200px",
							padding: "20px",
							borderRadius: "10px",
							boxShadow: "0px 0px 10px 0px var(--gray)",
						}}
						onClick={() => onTeamClick(team.id)}
					>
						<div
							style={{
								width: "100%",
								height: "40px",
								color: "var(--black)",
								fontSize: "24px",
							}}
						>
							{team.name}
						</div>

						<div
							style={{
								width: "100%",
								height: "240px",
								overflowY: "auto",
							}}
						>
							{team.employees.map((employee) => (
								<div
									key={employee.id}
									style={{
										width: "100%",
										minHeight: "40px",
										color: "var(--black)",
										fontSize: "16px",
										cursor: "pointer",
									}}
									onAbort={() => onEmployeeClick(employee.id)}
								>
									{employee.username}
								</div>
							))}
						</div>
					</div>
				))}
		</div>
	);
};
