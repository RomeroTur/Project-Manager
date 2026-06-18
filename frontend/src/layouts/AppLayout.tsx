import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AppLayout = () => {
	return (
		<div className="flex min-h-screen bg-gray-100">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />

				<main className="p-6 flex-1">
					<div className="max-w-7xl mx-auto">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default AppLayout;
