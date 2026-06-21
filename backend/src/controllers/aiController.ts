import { RequestHandler } from "express";
import { aiClient, buildAdminContext, buildUserContext } from "#services";

const SYSTEM_PROMPT = `
You are a Project Assistant AI.

RULES:
- You can ONLY use the provided context.
- If data is not in context, say you don't have access.
`;

//- Users cannot see projects they are not assigned to.

export const aiChatController: RequestHandler = async (req: any, res, next) => {
	try {
		const { message } = req.body;

		const user = req.user;

		let context;

		if (user.role === "admin") {
			context = await buildAdminContext();
		} else {
			context = await buildUserContext(user.userId);
		}

		const response = await aiClient.chat.completions.create({
			model: "claude-haiku-4-5",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{
					role: "system",
					content: `CONTEXT:\n${JSON.stringify(context)}`,
				},
				{ role: "user", content: message },
			],
		});

		const answer = response.choices?.[0]?.message;

		res.json({
			answer,
		});
	} catch (err) {
		next(err);
	}
};
