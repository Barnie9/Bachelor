import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Reports } from "./pages/Reports";
import { Layout } from "./pages/Layout";
import { Teams } from "./pages/Teams";
import { useAppSelector } from "./redux/hooks";
import { selectUser } from "./redux/slices/userSlice";
import Login from "./pages/Login";

const DefaultRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="*" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
};

const ManagerRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Reports />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

const AdminRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Teams />} />
					<Route path="teams" element={<Teams />} />
					<Route path="team/:teamId" element={<Reports />} />
					<Route path="employee/:employeeId" element={<Reports />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

export const App = () => {
	const user = useAppSelector(selectUser);

	if (user.id === undefined) {
		return <DefaultRoutes />;
	}

	if (user.isAdmin) {
		return <AdminRoutes />;
	}

	return <ManagerRoutes />;
};
