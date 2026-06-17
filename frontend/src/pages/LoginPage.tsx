import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
	const navigate = useNavigate();
	const { login, user, loading } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	if (!loading && user) {
		return (
			<Navigate
				to={user.role === "admin" ? "/admin" : "/dashboard"}
				replace
			/>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await login(email, password);

			// refresh user is already inside login()
			const me = await fetch("http://localhost:3000/users/me", {
				credentials: "include",
			});

			const currentUser = await me.json();

			navigate(currentUser.role === "admin" ? "/admin" : "/dashboard");
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div>
			<h1>Login</h1>

			<form onSubmit={handleSubmit} className="form">
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
				/>

				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>

				<button type="submit">Login</button>
			</form>

			{error && <p>{error}</p>}
		</div>
	);
};

export default LoginPage;
