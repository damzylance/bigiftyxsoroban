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

export function validatePhoneNumber(phoneNumber: string): boolean {
	// Regular expression to match Nigerian phone numbers starting with 070, 080, 090, or 081 followed by 8 digits
	const phoneRegex = /^(0[789]0)\d{8}$/;
	return phoneRegex.test(phoneNumber);
}
export function extractDataValue(purchaseString: string): string {
	// Regular expression to capture a number followed by optional spaces and a unit (MB, GB, etc.)
	const dataRegex = /(\d+)\s?(MB|GB)/i;
	const match = purchaseString.match(dataRegex);
	return match ? `${match[1]} ${match[2]}` : "";
}

export type ProviderType = {
	id: string;
	name: string;
	logo: string;
	billerCode: string;
	itemCode: string;
};
