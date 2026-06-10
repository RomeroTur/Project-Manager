import {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import { apiGetMe, apiLogout, type AuthUser } from "../api/auth";

interface AuthContextValue {
	user: AuthUser | null;
	/** true while the initial session check is in flight */
	loading: boolean;
	/** Call after a successful login to sync the user into context */
	refreshUser: () => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = useCallback(async () => {
		try {
			const me = await apiGetMe();
			setUser(me);
		} catch {
			setUser(null);
		}
	}, []);

	const logout = useCallback(async () => {
		await apiLogout().catch(() => {});
		setUser(null);
	}, []);

	// On mount: try to restore the session from the httpOnly cookie
	useEffect(() => {
		refreshUser().finally(() => setLoading(false));
	}, [refreshUser]);

	return (
		<AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
	return ctx;
}
