import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-semibold text-white">
        Welcome back, {user?.firstname}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Admin overview — projects, users, and tasks across the workspace.
      </p>
    </div>
  );
}

export function UserDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-xl font-semibold text-white">
        Welcome back, {user?.firstname}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Your assigned projects will appear here.
      </p>
    </div>
  );
}
