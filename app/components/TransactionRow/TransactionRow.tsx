import { formatDate } from "@/app/utils/utils";
import { HStack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { FaGlobe, FaMobileAlt, FaTv } from "react-icons/fa";
import { FaBolt } from "react-icons/fa6";

type Props = {
	type: string;
	amount: string;
	tokenAmount: string;
	date: string;
	status: string;
};

const TransactionRow = ({ type, amount, tokenAmount, date, status }: Props) => {
	const transactionIcon = () => {
		if (type.toLowerCase() === "airtime") {
			return <FaMobileAlt />;
		} else if (type.toLocaleLowerCase() === "mobiledata") {
			return <FaGlobe />;
		} else if (type.toLocaleLowerCase() === "electricity") {
			return <FaBolt />;
		} else if (type.toLocaleLowerCase() === "cable") {
			return <FaTv />;
		}
	};
	const formatedDate = formatDate(date);
	return (
		<HStack
			width={"full"}
			justifyContent={"space-between"}
			alignItems={"center"}
			textTransform={"capitalize"}
		>
			<HStack>
				<HStack
					padding={"10px"}
					bg={"#dfe6f2"}
					color={"rgb(16, 61, 150)"}
					borderRadius={"50%"}
				>
					{transactionIcon()}
				</HStack>
				<VStack alignItems={"flex-start"} gap={0}>
					<Text fontSize={"xs"} textTransform={"capitalize"}>
						{type.toLowerCase()}
					</Text>
					<Text fontSize={"xx-small"}>{formatedDate}</Text>
				</VStack>
			</HStack>
			<VStack alignItems={"flex-end"} gap={"1px"}>
				<Text fontSize={"xs"}>
					{" "}
					{type === "redeem" ? "+" : "-"} ₦{amount}
				</Text>
				<Text fontSize={"xx-small"}>
					{"USDC "}
					{tokenAmount}
				</Text>
				<Text
					padding={"1px 4px"}
					borderRadius={"8px"}
					bg={status === "success" ? "#dfe6f2" : "#faddce"}
					fontSize={"xx-small"}
				>
					{status}
				</Text>
			</VStack>
		</HStack>
	);
};

export default TransactionRow;
