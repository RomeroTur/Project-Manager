import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AppLayout = () => {
	return (
		<div className="flex min-h-screen">
			<Sidebar />

			<div className="flex-1 flex flex-col">
				<Header />

				<main className="p-6 bg-gray-50 flex-1">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AppLayout;
