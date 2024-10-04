import { Text, VStack } from "@chakra-ui/react";
import React from "react";

type Props = {
	action: () => void;
	ticker: string;
	amount: string;
	tokenAmount: string;
	tokenTicker: string;
};

const AmountCard = ({
	action,
	ticker,
	amount,
	tokenAmount,
	tokenTicker,
}: Props) => {
	return (
		<VStack
			onClick={action}
			p={"20px 4px"}
			borderRadius={"12px"}
			bg={"#dfe6f2"}
			cursor={"pointer"}
		>
			<Text fontSize={"md"} fontWeight={"800"}>
				<span style={{ fontSize: "14px" }}>{ticker}</span>
				{amount}
			</Text>

			<Text fontSize={"xs"}>
				{tokenTicker} {(parseFloat(amount) / 1700).toFixed(2)}
			</Text>
		</VStack>
	);
};

export default AmountCard;
