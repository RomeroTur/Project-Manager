import { RequestHandler } from "express";
import { aiClient, buildAdminContext, buildUserContext } from "#services";

const SYSTEM_PROMPT = `
You are a Project Assistant AI.

RULES:
- Use ONLY the provided data.
- Never mention "context", "provided context", "database", "JSON", "records", or "system prompt".
- Answer naturally as if you already know the information.
- If information is unavailable, simply say:
  "I don't have that information."
- Do not explain where the information came from.
- Do not expose technical fields such as _id, ObjectId, __v, password hashes, internal references, timestamps.
- Give concise and direct answers.
`;

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
