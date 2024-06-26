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
            {isTeamsSuccess && teams.map((team) => (
                <div
                    key={team.id + "-team"}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        height: "200px",
                        width: "200px",
                        padding: "20px",
                        borderRadius: "10px",
                        backgroundColor: "var(--light-gray)",
                    }}
                    onClick={() => onTeamClick(team.id)}
                >
                    <h2>{team.name}</h2>

                    <h3>Employees</h3>

                    {team.employees.map((employee) => (
                        <p key={employee.id}>{employee.username}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};