import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../schemas/loginSchema";

import { API_URL } from "../config/api";

const LoginPage = () => {
	const [formError, setFormError] = useState("");
	const navigate = useNavigate();
	const { login, user, loading } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});

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

		const result = loginSchema.safeParse({ email, password });

		if (!result.success) {
			const fieldErrors: typeof errors = {};

			for (const issue of result.error.issues) {
				if (issue.path[0] === "email") {
					fieldErrors.email = issue.message;
				}
				if (issue.path[0] === "password") {
					fieldErrors.password = issue.message;
				}
			}

			setErrors(fieldErrors);
			return;
		}

		setErrors({});

		try {
			await login(email, password);

			const me = await fetch(`${API_URL}/users/me`, {
				credentials: "include",
			});

			const currentUser = await me.json();

			navigate(currentUser.role === "admin" ? "/admin" : "/dashboard");
		} catch (err: unknown) {
			if (err instanceof Error) {
				setFormError(err.message);
			} else {
				setFormError("Login failed");
			}
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
				{/* HEADER */}
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-gray-800">Login</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* EMAIL */}
					<div>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Email"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						{errors.email && (
							<p className="text-red-500 text-xs mt-1">
								{errors.email}
							</p>
						)}
					</div>

					{/* PASSWORD */}
					<div>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						{errors.password && (
							<p className="text-red-500 text-xs mt-1">
								{errors.password}
							</p>
						)}
					</div>

					{/* FORM ERROR */}
					{formError && (
						<div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-md">
							{formError}
						</div>
					)}

					{/* BUTTON */}
					<button
						type="submit"
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
