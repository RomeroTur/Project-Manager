import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
	const navigate = useNavigate();

	const { login, user, loading } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	// Already logged in?
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

		setError("");

		const validation = loginSchema.safeParse({
			email,
			password,
		});

		if (!validation.success) {
			setError(validation.error.issues[0].message);
			return;
		}

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

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			// AuthProvider fetches /users/me
			await login();

			// Ask backend who is logged in
			const meResponse = await fetch("http://localhost:3000/users/me", {
				credentials: "include",
			});

			if (!meResponse.ok) {
				throw new Error("Could not load user information");
			}

			const currentUser = await meResponse.json();

			if (currentUser.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/dashboard");
			}
		} catch (err) {
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

			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<button type="submit">Login</button>
			</form>

			{error && (
				<p
					style={{
						color: "red",
						marginTop: "1rem",
					}}
				>
					{error}
				</p>
			)}
		</div>
	);
};

export default LoginPage;
