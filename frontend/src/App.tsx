import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";

import UsersPage from "./pages/UsersPage";
import UserListPage from "./pages/UserListPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserEditPage from "./pages/UserEditPage";
import CreateUserPage from "./pages/CreateUserPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import AppLayout from "./layouts/AppLayout";

import "./index.css";

//import ChatBot from "./components/ChatBot";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					{/* PUBLIC */}
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>
					<Route path="/login" element={<LoginPage />} />

					{/* PROTECTED */}
					<Route element={<ProtectedRoute />}>
						<Route element={<AppLayout />}>
							{/* DASHBOARD */}
							<Route
								path="/dashboard"
								element={<UserDashboard />}
							/>

							{/* PROFILE */}
							<Route
								path="/profile"
								element={<UserDetailsPage />}
							/>

							{/* PROJECTS */}
							<Route
								path="/projects"
								element={<ProjectsPage />}
							/>
							<Route
								path="/projects/:id"
								element={<ProjectDetailsPage />}
							/>

							{/* USERS (LIST + VIEW) */}
							<Route path="/users" element={<UserListPage />} />
							<Route
								path="/users/:id"
								element={<UserDetailsPage />}
							/>
						</Route>
					</Route>

					{/* ADMIN */}
					<Route element={<ProtectedRoute />}>
						<Route element={<AdminRoute />}>
							<Route element={<AppLayout />}>
								<Route
									path="/admin"
									element={<AdminDashboard />}
								/>

								<Route
									path="/admin/projects"
									element={<ProjectsPage />}
								/>
								<Route
									path="/admin/projects/create"
									element={<CreateProjectPage />}
								/>
								<Route
									path="/admin/projects/:id/edit"
									element={<EditProjectPage />}
								/>
								<Route
									path="/admin/projects/:id"
									element={<ProjectDetailsPage />}
								/>

								<Route
									path="/admin/users"
									element={<UsersPage />}
								/>
								<Route
									path="/admin/users/register"
									element={<CreateUserPage />}
								/>
								<Route
									path="/admin/users/:id"
									element={<UserDetailsPage />}
								/>
								<Route
									path="/admin/users/:id/edit"
									element={<UserEditPage />}
								/>
							</Route>
						</Route>
					</Route>

					{/* fallback */}
					<Route
						path="*"
						element={<Navigate to="/dashboard" replace />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
