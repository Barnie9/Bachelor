import Button from "../components/Button";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../utils/authConfig";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slices/userSlice";
import { useGetManagerByEmailMutation } from "../redux/serverApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentManagerId } from "../redux/slices/globalState";

const Login = () => {
	const { instance } = useMsal();

	const navigate = useNavigate();

	const dispatch = useAppDispatch();

	const [
		getManagerByEmail,
		{ data: manager, isSuccess: isGetManagerByEmailSuccess, isError: isGetManagerByEmailError },
	] = useGetManagerByEmailMutation();

	const signIn = async () => {
		try {
			const loginResponse = await instance.loginPopup(loginRequest);

			dispatch(
				setUser({
					username: loginResponse.account.name!,
					email: loginResponse.account.username,
					token: loginResponse.idToken,
				})
			);

			getManagerByEmail(loginResponse.account.username);
		} catch (error) {
			alert("Login failed.");
		}
	};

	useEffect(() => {
		if (isGetManagerByEmailSuccess && manager) {
			dispatch(setUser(manager));
			if (manager.isAdmin === false) {
				dispatch(setCurrentManagerId(manager.id!));
			}
			navigate("/");
			return;
		}

		if (isGetManagerByEmailError) {
			alert("Login failed. You don't have a manager account.");
			return;
		}
	}, [isGetManagerByEmailSuccess, isGetManagerByEmailError]);

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-around",
				alignItems: "center",
				height: "100vh",
				width: "100%",
			}}
		>
			<Button
				text="LOGIN"
				textColor="--black"
				backgroundColor="--white"
				hoverBackgroundColor="--light-gray"
				onClick={signIn}
			/>
		</div>
	);
};

export default Login;
