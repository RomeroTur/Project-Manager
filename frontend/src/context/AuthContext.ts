import { createContext } from "react";
import type { User } from "../types/User";

export type AuthContextType = {
	user: User | null;
	loading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
