import { useEffect, useState } from "react";
import type { User } from "../types/User";
import { AuthContext } from "../context/AuthContext";
//import type { AuthContextType } from "../context/auth.types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	// GET CURRENT USER
	const refreshUser = async () => {
		try {
			const res = await fetch("http://localhost:3000/users/me", {
				credentials: "include",
			});

			if (!res.ok) {
				setUser(null);
				return;
			}

			const data = await res.json();
			setUser(data);
		} catch {
			setUser(null);
		}
	};

	// LOGIN
	const login = async (email: string, password: string) => {
		const res = await fetch("http://localhost:3000/users/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.message || "Login failed");
		}

		await refreshUser();
	};

	// LOGOUT
	const logout = async () => {
		await fetch("http://localhost:3000/users/logout", {
			method: "POST",
			credentials: "include",
		});

		setUser(null);
	};

	// INIT
	useEffect(() => {
		(async () => {
			await refreshUser();
			setLoading(false);
		})();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				refreshUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
