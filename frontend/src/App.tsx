import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";

import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";
import UserEditPage from "./pages/UserEditPage";
import CreateUserPage from "./pages/CreateUserPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

//import AdminLayout from "./layouts/AdminLayout";
import AppLayout from "./layouts/AppLayout";

import "./index.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/login" replace />} />
				<Route path="/login" element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route element={<AppLayout />}>
						{/* USER ROUTES */}
						<Route path="/dashboard" element={<UserDashboard />} />

						<Route path="/projects" element={<ProjectsPage />} />
						<Route
							path="/projects/:id"
							element={<ProjectDetailsPage />}
						/>

						<Route
							path="/users/:id"
							element={<UserDetailsPage />}
						/>

						{/* ADMIN ROUTES */}
						<Route element={<AdminRoute />}>
							<Route path="/admin">
								<Route index element={<AdminDashboard />} />

								<Route
									path="projects"
									element={<ProjectsPage />}
								/>
								<Route
									path="projects/create"
									element={<CreateProjectPage />}
								/>
								<Route
									path="projects/:id/edit"
									element={<EditProjectPage />}
								/>
								<Route
									path="projects/:id"
									element={<ProjectDetailsPage />}
								/>

								<Route path="users" element={<UsersPage />} />
								<Route
									path="users/register"
									element={<CreateUserPage />}
								/>
								<Route
									path="users/:id"
									element={<UserDetailsPage />}
								/>
								<Route
									path="users/:id/edit"
									element={<UserEditPage />}
								/>
							</Route>
						</Route>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
