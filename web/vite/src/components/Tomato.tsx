// little tomato mascot shown above the timer
export default function Tomato({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 64 64"
			className={className}
			aria-hidden="true">
			<path
				d="M32 18c10 0 18 7 18 17s-8 17-18 17S14 45 14 35s8-17 18-17Z"
				fill="#ef4444"
			/>
			<path
				d="M32 18c3-5 8-7 12-6-2 3-5 5-8 6 4-1 8 0 11 2-4 2-8 2-11 1 2 3 4 6 4 10-4-2-7-5-8-9-1 4-4 7-8 9 0-4 2-7 4-10-3 1-7 1-11-1 3-2 7-3 11-2-3-1-6-3-8-6 4-1 9 1 12 6Z"
				fill="#16a34a"
			/>
			<ellipse
				cx="24"
				cy="30"
				rx="4"
				ry="3"
				fill="#fca5a5"
				opacity="0.6"
			/>
		</svg>
	);
}
