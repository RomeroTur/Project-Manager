import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { faker } from "@faker-js/faker";

import dotenv from "dotenv";

import { User } from "#models";
import { Project } from "#models";

async function seed() {
	dotenv.config();
	try {
		await mongoose.connect(process.env.DB_URL!);

		console.log("Connected");

		// wipe existing data
		await User.deleteMany({});
		await Project.deleteMany({});

		/* =========================
		   USERS
		========================= */

		const password = await bcrypt.hash("Password123", 13);

		const users = [];

		// 2 admins
		for (let i = 0; i < 2; i++) {
			users.push(
				await User.create({
					firstname: faker.person.firstName(),
					lastname: faker.person.lastName(),
					email: `admin${i + 1}@company.com`,
					password,
					role: "admin",

					available: true,

					skills: ["Management", "Planning", "Leadership"],

					personal: {
						tel: faker.phone.number(),
						address: faker.location.streetAddress(),
						description:
							"Project manager responsible for company operations.",
					},
				}),
			);
		}

		// 13 regular users
		const skillPool = [
			"React",
			"TypeScript",
			"Node.js",
			"MongoDB",
			"UI Design",
			"UX Design",
			"Figma",
			"QA Testing",
			"DevOps",
			"Project Management",
		];

		for (let i = 0; i < 13; i++) {
			users.push(
				await User.create({
					firstname: faker.person.firstName(),
					lastname: faker.person.lastName(),
					email: `user${i + 1}@company.com`,
					password,
					role: "user",

					available: faker.datatype.boolean(),

					skills: faker.helpers.arrayElements(
						skillPool,
						faker.number.int({ min: 2, max: 4 }),
					),

					personal: {
						tel: faker.phone.number(),
						address: faker.location.streetAddress(),
						description: faker.person.jobTitle(),
					},
				}),
			);
		}

		/* =========================
		   PROJECTS
		========================= */

		const projectNames = [
			"Customer Portal",
			"Inventory System",
			"Mobile Banking App",
			"E-commerce Platform",
			"HR Dashboard",
			"Restaurant Booking",
			"Design System",
			"CRM Upgrade",
			"Analytics Platform",
			"Support Ticket System",
		];

		for (const name of projectNames) {
			const members = faker.helpers.arrayElements(
				users.filter((u) => u.role === "user"),
				faker.number.int({ min: 3, max: 6 }),
			);

			const tasks = members.map((member) => ({
				taskTitle: faker.helpers.arrayElement([
					"Frontend Development",
					"Backend API",
					"Database Setup",
					"UI Design",
					"Testing",
					"Documentation",
				]),

				taskMember: member._id,

				taskStatus: faker.helpers.arrayElement([
					"in process",
					"completed",
					"on hold",
				]),

				timeSpentTotal: "8h 30m",

				timeSpentRecords: [
					{
						user: member._id,
						firstname: member.firstname,
						lastname: member.lastname,

						date: faker.date.recent(),

						hours: faker.number.int({
							min: 1,
							max: 8,
						}),

						minutes: faker.number.int({
							min: 0,
							max: 59,
						}),
					},
				],
			}));

			await Project.create({
				projectTitle: name,

				projectDescription: faker.company.catchPhrase(),

				projectStatus: faker.helpers.arrayElement([
					"in process",
					"completed",
					"on hold",
				]),

				projectMembers: members.map((member) => member._id),

				createdBy: users[0]._id,

				startDate: faker.date.past(),

				endDate: faker.date.future(),

				tasks,

				comments: [
					{
						title: "Project Kickoff",

						author: users[0]._id,

						firstname: users[0].firstname,
						lastname: users[0].lastname,

						comment: "Project has officially started.",
					},
				],
			});
		}

		console.log("Seed complete");
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

seed();
