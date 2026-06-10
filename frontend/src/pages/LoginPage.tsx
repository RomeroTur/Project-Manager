import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginSchema } from "../schemas/loginSchema";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
	const navigate = useNavigate();

	const { login } = useAuth();

	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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
				body: JSON.stringify({
					email,
					password,
				}),
			});

			const data = await response.json();

			login(data.user, data.token);

			if (data.user.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/dashboard");
			}
		} catch (err) {
			console.log("err: ", err);
			setError("Login failed");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h1>Login</h1>

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

			{error && <p>{error}</p>}
		</form>
	);
};

export default LoginPage;
