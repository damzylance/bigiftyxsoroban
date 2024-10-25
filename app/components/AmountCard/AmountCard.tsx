import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { useWallet } from "@/app/context/WalletContext";
import { validatePhoneNumber } from "@/app/utils/utils";
import { Text, VStack } from "@chakra-ui/react";
import React from "react";

type Props = {
	action: () => void;
	amount: string;
	currencyTicker: string;
	tokenTicker: string;
};

const AmountCard = ({ action, currencyTicker, amount, tokenTicker }: Props) => {
	const { setFiatAmount, setTokenAmount, phoneNumber } = useAirtimePurchase();
	const { walletAddress } = useWallet();

	return (
		<VStack
			onClick={() => {
				setFiatAmount(parseFloat(amount));
				setTokenAmount(parseFloat(amount) / 1700);
				action();
			}}
			p={"20px 4px"}
			borderRadius={"12px"}
			bg={"#dfe6f2"}
			cursor={"pointer"}
		>
			<Text fontSize={"md"} fontWeight={"800"}>
				<span style={{ fontSize: "14px" }}>{currencyTicker}</span>
				{amount}
			</Text>

			<Text fontSize={"xs"}>
				{tokenTicker} {(parseFloat(amount) / 1700).toFixed(2)}
			</Text>
		</VStack>
	);
};

export default AmountCard;
