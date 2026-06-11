import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);

	const [loading, setLoading] = useState(true);

	const login = async () => {
		try {
			const response = await fetch("http://localhost:3000/users/me", {
				credentials: "include",
			});

			if (!response.ok) {
				setUser(null);
				return;
			}

			const userData = await response.json();

			setUser(userData);
		} catch (err) {
			console.error(err);
			setUser(null);
		}
	};

	const logout = async () => {
		try {
			await fetch("http://localhost:3000/users/logout", {
				method: "POST",
				credentials: "include",
			});
		} catch (err) {
			console.error(err);
		}

		setUser(null);
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch("http://localhost:3000/users/me", {
					credentials: "include",
				});

				if (!response.ok) {
					setUser(null);
					return;
				}

				const userData = await response.json();

				setUser(userData);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
