import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const UserEditPage = () => {
	const { user: authUser } = useAuth();

	const { id } = useParams();
	const navigate = useNavigate();

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");

	const [role, setRole] = useState<"admin" | "user">("user");

	const [skills, setSkills] = useState("");

	const [birthday, setBirthday] = useState("");
	const [tel, setTel] = useState("");
	const [address, setAddress] = useState("");
	const [description, setDescription] = useState("");

	const [error, setError] = useState("");

	/* =========================
	   LOAD USER
	========================= */
	useEffect(() => {
		const loadUser = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/users/${id}`,
					{
						credentials: "include",
					},
				);

				const user = await response.json();

				setFirstname(user.firstname ?? "");
				setLastname(user.lastname ?? "");
				setEmail(user.email ?? "");
				setRole(user.role ?? "user");

				setSkills(user.skills?.join(", ") ?? "");

				setBirthday(
					user.personal?.birthday
						? new Date(user.personal.birthday)
								.toISOString()
								.split("T")[0]
						: "",
				);

				setTel(user.personal?.tel ?? "");
				setAddress(user.personal?.address ?? "");
				setDescription(user.personal?.description ?? "");
			} catch (err) {
				console.error(err);
			}
		};

		loadUser();
	}, [id]);

	/* =========================
	   SAVE USER
	========================= */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`http://localhost:3000/users/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					firstname,
					lastname,
					email,
					role,
					skills: skills
						.split(",")
						.map((s) => s.trim())
						.filter(Boolean),

					personal: {
						birthday: birthday || undefined,
						tel,
						address,
						description,
					},
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to update user");
			}

			navigate("/admin/users");
		} catch (err) {
			if (err instanceof Error) setError(err.message);
		}
	};

	/* =========================
	   DELETE USER
	========================= */
	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this user?",
		);

		if (!confirmDelete) return;

		try {
			await fetch(`http://localhost:3000/users/${id}`, {
				method: "DELETE",
				credentials: "include",
			});

			navigate("/admin/users");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			{/* =========================
			   ACTIONS (TOP BAR)
			========================= */}
			<div className="flex justify-end gap-3 mb-6">
				<button
					type="submit"
					form="user-form"
					className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
				>
					Save Changes
				</button>

				<button
					type="button"
					onClick={() => navigate(-1)}
					className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
				>
					Cancel
				</button>

				{authUser?._id !== id && (
					<button
						type="button"
						onClick={handleDelete}
						className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
					>
						Delete User
					</button>
				)}
			</div>

			{/* =========================
			   FORM
			========================= */}
			<form
				id="user-form"
				onSubmit={handleSubmit}
				className="grid grid-cols-1 lg:grid-cols-2 gap-6"
			>
				{/* =========================
				   LEFT CARD - MAIN INFO
				========================= */}
				<div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
					<h1 className="text-xl font-bold">Edit User</h1>

					<div>
						<label className="text-sm text-gray-600">
							First Name
						</label>
						<input
							className="w-full border p-2 rounded"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">
							Last Name
						</label>
						<input
							className="w-full border p-2 rounded"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">Email</label>
						<input
							type="email"
							className="w-full border p-2 rounded"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">Role</label>
						<select
							className="w-full border p-2 rounded"
							value={role}
							onChange={(e) =>
								setRole(e.target.value as "admin" | "user")
							}
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>

					<div>
						<label className="text-sm text-gray-600">
							Skills (comma separated)
						</label>
						<input
							className="w-full border p-2 rounded"
							value={skills}
							onChange={(e) => setSkills(e.target.value)}
							placeholder=""
						/>
					</div>
				</div>

				{/* =========================
				   RIGHT CARD - PERSONAL INFO
				========================= */}
				<div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
					<h2 className="text-lg font-semibold">
						Personal Information
					</h2>

					<div>
						<label className="text-sm text-gray-600">
							Birthday
						</label>
						<input
							type="date"
							className="w-full border p-2 rounded"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">
							Telephone
						</label>
						<input
							className="w-full border p-2 rounded"
							value={tel}
							onChange={(e) => setTel(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">Address</label>
						<textarea
							className="w-full border p-2 rounded"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</div>

					<div>
						<label className="text-sm text-gray-600">
							Description
						</label>
						<textarea
							className="w-full border p-2 rounded"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>
			</form>

			{/* =========================
			   ERROR
			========================= */}
			{error && (
				<div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
					{error}
				</div>
			)}
		</>
	);
};

export default UserEditPage;
