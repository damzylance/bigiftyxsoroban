import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { useWallet } from "@/app/context/WalletContext";
import { validatePhoneNumber } from "@/app/utils/utils";
import { Text, VStack } from "@chakra-ui/react";
import React from "react";

type Props = {
	action: () => void;
	currencyTicker: string;
	amount: string;
	tokenTicker: string;
	plan: string;
	itemCode: string;
};

const TvAmountCard = ({
	action,
	currencyTicker,
	amount,
	tokenTicker,
	plan,
	itemCode,
}: Props) => {
	const {
		setFiatAmount,
		setTokenAmount,
		phoneNumber,
		setSelectedProvider,
		selectedProvider,
	} = useAirtimePurchase();
	const { walletAddress } = useWallet();

	return (
		<VStack
			alignItems={"flex-start"}
			onClick={() => {
				if (validatePhoneNumber(phoneNumber) && walletAddress) {
					setFiatAmount(parseFloat(amount));
					setTokenAmount(parseFloat(amount) / 1700);
					setSelectedProvider({
						...selectedProvider,
						itemCode: itemCode,
					});
					action();
				}
			}}
			p={"4px"}
			gap={"0"}
			borderRadius={"12px"}
			bg={"#dfe6f2"}
			cursor={"pointer"}
		>
			<Text fontSize={"sm"} fontWeight={"600"}>
				{plan}
			</Text>

			<Text fontSize={"sm"}>
				{currencyTicker} {amount}
			</Text>
			<Text fontSize={"xs"}>
				{tokenTicker} {(parseFloat(amount) / 1700).toFixed(2)}
			</Text>
		</VStack>
	);
};

export default TvAmountCard;
