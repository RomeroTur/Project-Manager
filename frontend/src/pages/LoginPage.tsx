import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import { apiLogin } from "../api/auth";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";

export default function LoginPage() {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			await apiLogin({ email, password });
			// Sync the user from the cookie into context, then redirect by role
			await refreshUser();
			// refreshUser sets the user; read role from /me response via context
			// We navigate to a neutral route — ProtectedRoute will redirect by role
			navigate("/", { replace: true });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
			<div className="w-full max-w-sm">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-semibold tracking-tight text-white">
						Taskflow
					</h1>
					<p className="mt-1 text-sm text-gray-500">
						Sign in to your workspace
					</p>
				</div>

				{/* Card */}
				<div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<Input
							label="Email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
							required
						/>

						<Input
							label="Password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							autoComplete="current-password"
							required
						/>

						{error && (
							<p className="rounded-md bg-red-900/30 border border-red-700/50 px-3 py-2 text-xs text-red-400">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="mt-1 rounded-md bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Signing in…" : "Sign in"}
						</button>
					</form>
				</div>

				<p className="mt-4 text-center text-xs text-gray-600">
					No account?{" "}
					<Link
						to="/register"
						className="text-violet-400 hover:text-violet-300"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
