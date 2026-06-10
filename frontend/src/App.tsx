import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RootRedirect from "./pages/RootRedirect";
import { AdminDashboard, UserDashboard } from "./pages/Dashboards";

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					{/* Public routes */}
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					{/* Root: redirect to correct dashboard by role */}
					<Route path="/" element={<RootRedirect />} />

					{/* Admin-only routes */}
					<Route element={<ProtectedRoute role="admin" />}>
						<Route element={<Layout />}>
							<Route path="/admin" element={<AdminDashboard />} />
							{/* Add more admin routes here, e.g.:
							<Route path="/admin/projects" element={<AdminProjects />} />
							<Route path="/admin/users"    element={<AdminUsers />} />
							<Route path="/admin/tasks"    element={<AdminTasks />} />
							*/}
						</Route>
					</Route>

					{/* User routes */}
					<Route element={<ProtectedRoute role="user" />}>
						<Route element={<Layout />}>
							<Route
								path="/dashboard"
								element={<UserDashboard />}
							/>
							{/* Add more user routes here, e.g.:
              <Route path="/dashboard/tasks" element={<UserTasks />} />
              */}
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
