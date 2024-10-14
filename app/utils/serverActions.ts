import axios from "axios";

type AirtimeData = {
	bill_type: string;
	item_code?: string;
	biller_code?: string;
	amount: number;
	crypto_amount: string;
	customer: string;
	chain: string;
	wallet_address: string;
	transaction_hash: string | null;
	country: string;
};
type createGiftcardData = {
	transaction_hash: string | null | undefined;
	currency: string;
	image: number;
	wallet: string;
	amount: number;
	receipent_email: string;
	note?: string;
};

export const buyAirtime = async (data: AirtimeData) => {
	console.log(data);
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL}/create-bill-transaction/`,
			data
		);
		console.log(response.data);
		return response;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Axios-specific error handling
			console.error("Axios error:", error.response?.data || error.message);
		} else if (error instanceof Error) {
			// Generic error handling
			console.error("Error:", error.message);
		} else {
			console.error("Unexpected error:", error);
		}
		return error;
	}
};

export const sendGiftCard = async (data: createGiftcardData) => {
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
