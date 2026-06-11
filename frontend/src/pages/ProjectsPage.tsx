import { Link } from "react-router-dom";

const ProjectsPage = () => {
	return (
		<div>
			<div className="flex justify-between">
				<h1>Projects</h1>

				<Link to="/admin/projects/create">Create Project</Link>
			</div>

			<div>
				<p>List of projects will appear here.</p>
			</div>
		</div>
	);
};

export default ProjectsPage;
