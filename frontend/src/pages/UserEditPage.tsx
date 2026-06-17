import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEditPage = () => {
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

	useEffect(() => {
		const loadUser = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/users/${id}`,
					{
						credentials: "include",
					},
				);

				if (!response.ok) {
					throw new Error("Failed to load user");
				}

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
						.map((skill) => skill.trim())
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
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="form grid grid-cols-2 gap-8">
			<div className="space-y-4">
				<h1>Edit User</h1>

				<div>
					<label>First Name</label>

					<input
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
					/>
				</div>

				<div>
					<label>Last Name</label>

					<input
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>
				</div>

				<div>
					<label>Email</label>

					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div>
					<label>Role</label>

					<select
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
					<label>Skills</label>

					<input
						value={skills}
						onChange={(e) => setSkills(e.target.value)}
						placeholder="React, Node, TypeScript"
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h2>Personal Information</h2>

				<div>
					<label>Birthday</label>

					<input
						type="date"
						value={birthday}
						onChange={(e) => setBirthday(e.target.value)}
					/>
				</div>

				<div>
					<label>Telephone</label>

					<input
						value={tel}
						onChange={(e) => setTel(e.target.value)}
					/>
				</div>

				<div>
					<label>Address</label>

					<textarea
						value={address}
						onChange={(e) => setAddress(e.target.value)}
					/>
				</div>

				<div>
					<label>Description</label>

					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>
			</div>

			<div className="col-span-2 flex gap-4">
				<button type="submit">Save Changes</button>

				<button type="button" onClick={() => navigate(-1)}>
					Cancel
				</button>
			</div>

			{error && (
				<div className="col-span-2">
					<p style={{ color: "red" }}>{error}</p>
				</div>
			)}
		</form>
	);
};

export default UserEditPage;
