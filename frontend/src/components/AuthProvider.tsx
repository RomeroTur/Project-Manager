import { useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/User";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(
		JSON.parse(localStorage.getItem("user") || "null"),
	);

	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token"),
	);

	const login = (user: User, token: string) => {
		setUser(user);
		setToken(token);

		localStorage.setItem("user", JSON.stringify(user));
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setUser(null);
		setToken(null);

		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
