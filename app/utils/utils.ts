export function formatDate(dateString: string) {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	// Convert the input string to a Date object
	const date = new Date(dateString);

	// Extract month, day, and time components
	const month = months[date.getUTCMonth()]; // Get month name
	const day = date.getUTCDate(); // Get day
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");
	const seconds = date.getUTCSeconds().toString().padStart(2, "0");

	// Append "st", "nd", "rd", "th" to the day
	const getDaySuffix = (day: number) => {
		if (day > 3 && day < 21) return "th";
		switch (day % 10) {
			case 1:
				return "st";
			case 2:
				return "nd";
			case 3:
				return "rd";
			default:
				return "th";
		}
	};

	const formattedDate = `${month} ${day}${getDaySuffix(
		day
	)}, ${hours}:${minutes}:${seconds}`;
	return formattedDate;
}

// Example usage
