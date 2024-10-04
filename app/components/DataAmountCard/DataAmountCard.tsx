import { Text, VStack } from "@chakra-ui/react";
import React from "react";

type Props = {
	action: () => void;
	currencyTicker: string;
	amount: string;
	tokenAmount: string;
	tokenTicker: string;
	plan: string;
};

const DataAmountCard = ({
	action,
	currencyTicker,
	amount,
	tokenAmount,
	tokenTicker,
	plan,
}: Props) => {
	return (
		<VStack
			onClick={action}
			p={"20px 4px"}
			borderRadius={"12px"}
			bg={"#dfe6f2"}
			cursor={"pointer"}
		>
			<Text fontSize={"lg"} fontWeight={"800"}>
				{plan}
			</Text>

			<Text fontSize={"sm"}>
				{currencyTicker} {amount}
			</Text>
			<Text fontSize={"xs"}>
				{tokenTicker} {tokenAmount}
			</Text>
		</VStack>
	);
};

export default DataAmountCard;
