import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateUserPage = () => {
	const navigate = useNavigate();

	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [role, setRole] = useState<"admin" | "user">("user");

	const [skills, setSkills] = useState("");

	const [birthday, setBirthday] = useState("");
	const [tel, setTel] = useState("");
	const [address, setAddress] = useState("");
	const [description, setDescription] = useState("");

	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(
				"http://localhost:3000/users/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify({
						firstname,
						lastname,
						email,
						password,
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
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to create user");
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
				<h1>Create User</h1>

				<div>
					<label>First Name</label>
					<input
						type="text"
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
					/>
				</div>

				<div>
					<label>Last Name</label>
					<input
						type="text"
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
					<label>Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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
					<label>Skills (comma separated)</label>

					<input
						type="text"
						value={skills}
						onChange={(e) => setSkills(e.target.value)}
						placeholder="React, TypeScript, Node"
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
						type="text"
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

			<div className="col-span-2">
				<button type="submit">Create User</button>

				<button
					type="button"
					onClick={() => navigate(-1)}
					style={{ marginLeft: "1rem" }}
				>
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

export default CreateUserPage;
