import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const [messages, setMessages] = useState<
		{ role: "user" | "assistant"; text: string }[]
	>([]);

	const sendMessage = async () => {
		if (!message.trim()) return;

		const userMessage = message;

		setMessages((prev) => [
			...prev,
			{
				role: "user",
				text: userMessage,
			},
		]);

		setMessage("");
		setLoading(true);

		try {
			const res = await fetch("http://localhost:3000/ai/chat", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: userMessage,
				}),
			});

			const data = await res.json();
			console.log("data: ", data);

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					text: data.answer?.content || "No response",
				},
			]);
		} catch (err) {
			console.error(err);

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					text: "Error contacting assistant.",
				},
			]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700"
			>
				AI
			</button>

			{open && (
				<div className="fixed bottom-24 right-6 w-96 h-[550px] bg-white border rounded-xl shadow-xl z-50 flex flex-col">
					<div className="p-4 border-b font-semibold">
						Project Assistant
					</div>

					<div className="flex-1 overflow-y-auto p-4 space-y-3">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={
									msg.role === "user"
										? "text-right"
										: "text-left"
								}
							>
								<div
									className={`inline-block px-3 py-2 rounded-lg text-sm ${
										msg.role === "user"
											? "bg-blue-600 text-white"
											: "bg-gray-100"
									}`}
								>
									<ReactMarkdown>{msg.text}</ReactMarkdown>
								</div>
							</div>
						))}

						{loading && (
							<p className="text-sm text-gray-500">Thinking...</p>
						)}
					</div>

					<div className="border-t p-3 flex gap-2">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									sendMessage();
								}
							}}
							placeholder="Question..."
							className="flex-1 border rounded px-3 py-2 text-sm"
						/>

						<button
							onClick={sendMessage}
							className="px-4 py-2 bg-blue-600 text-white rounded"
						>
							Send
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ChatBot;
