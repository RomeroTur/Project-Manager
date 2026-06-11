import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import RootRedirect from "./routes/RootRedirect";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<RootRedirect />} />

				<Route path="/login" element={<LoginPage />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<UserDashboard />} />

					<Route element={<AdminRoute />}>
						<Route path="/admin" element={<AdminDashboard />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
