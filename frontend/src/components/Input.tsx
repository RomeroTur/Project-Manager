import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export default function Input({ label, error, id, ...props }: InputProps) {
	const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
	return (
		<div className="flex flex-col gap-1">
			<label
				htmlFor={inputId}
				className="text-xs font-medium text-gray-400"
			>
				{label}
			</label>
			<input
				id={inputId}
				{...props}
				className={[
					"rounded-md border bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none",
					"placeholder:text-gray-600 transition-colors",
					"focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40",
					error ? "border-red-500" : "border-gray-700",
					props.className ?? "",
				].join(" ")}
			/>
			{error && <p className="text-xs text-red-400">{error}</p>}
		</div>
	);
}
