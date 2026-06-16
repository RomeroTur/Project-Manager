import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
			const response = await fetch("http://localhost:3000/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					email,
					password,
				}),
			});

			if (!response.ok) {
				const data = await response.json();

				throw new Error(data.message ?? "Invalid credentials");
			}

			await login();

			const meResponse = await fetch("http://localhost:3000/users/me", {
				credentials: "include",
			});

			const currentUser = await meResponse.json();

			if (currentUser.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/dashboard");
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Login failed");
			}
		}
	};

	return (
		<div>
			<h1>Login</h1>

			<form onSubmit={handleSubmit} className="form">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<button type="submit">Login</button>
			</form>

			{error && <p>{error}</p>}
		</div>
	);
};

export default LoginPage;
