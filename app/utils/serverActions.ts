import axios from "axios";

export const buyAirtime = async (data: any) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/create-bill-transaction/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error("Error:", error);
		return error;
	}
};

export const sendGiftCard = async (data: any) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/giftcard/create/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error("Error:", error);
		return error;
	}
};
