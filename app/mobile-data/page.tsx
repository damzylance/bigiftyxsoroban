"use client";

import DataAmountCard from "@/app/components/DataAmountCard/DataAmountCard";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
// import { PaymentPrompt } from "@/app/components/PaymentPrompt/PaymentPrompt";
import PhoneNumberInput from "@/app/components/PhoneNumberInput/PhoneNumberInput";
import { Grid, GridItem, Text, useDisclosure, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";
import axios from "axios";
import { extractDataValue } from "../utils/utils";
import { PaymentPrompt } from "../components/PaymentPrompt/PaymentPrompt";
import { usePhoneValidation } from "../utils/hooks/customValidation";
const supportedNetworks = [
	{
		name: "MTN",
		logo: "/images/icons/mobileproviders/mtnLogo.png",
		id: "1",
		billerCode: "BIL108",
		itemCode: "AT099",
	},
	{
		name: "GLO",
		logo: "/images/icons/mobileproviders/gloLogo.png",
		id: "2",
		billerCode: "BIL109",
		itemCode: "AT133",
	},
	{
		name: "Airtel",
		logo: "/images/icons/mobileproviders/airtelLogo.png",
		id: "3",
		billerCode: "BIL110",
		itemCode: "AT100",
	},
	{
		name: "9Mobile",
		logo: "/images/icons/mobileproviders/9mobileLogo.jpeg",
		id: "4",
		billerCode: "BIL111",
		itemCode: "AT134",
	},
];
interface Plan {
	item_code: string;
	biller_code: string;
	biller_name: string;
	amount: string;
}

const DataContent = () => {
	const { onOpen, isOpen, onClose } = useDisclosure();
	const {
		phoneNumber,
		setPhoneNumber,
		selectedProvider,
		fiatAmount,
		tokenAmount,
	} = useAirtimePurchase();
	const [dataPlans, setDataPlans] = useState([]);
	const fetchPlans = async () => {
		console.log(selectedProvider);
		await axios
			.get(
				`${process.env.NEXT_PUBLIC_BASE_URL2}v2/get-bill-info/?biller_code=${selectedProvider?.billerCode}`
			)
			.then((response) => {
				setDataPlans(response.data.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const { error: phoneNumberError } = usePhoneValidation();

	useEffect(() => {
		fetchPlans();
	}, [selectedProvider?.billerCode]);

	return (
		<PageWrapper page={"Mobile Data"}>
			<VStack gap={"40px"} width={"full"}>
				<VStack width={"full"} gap={0} alignItems={"flex-start"}>
					<PhoneNumberInput
						phoneNumber={phoneNumber}
						action={(e) => setPhoneNumber(e.target.value)}
						supportedNetworks={supportedNetworks}
					/>
					{phoneNumberError && (
						<Text color={"red.500"} fontSize={"xs"} ml={2} mt={1}>
							{phoneNumberError}
						</Text>
					)}
				</VStack>

				<VStack
					gap={"30px"}
					padding={" 20px 10px"}
					width={"full"}
					borderRadius={"12px"}
					alignItems={"flex-start"}
					bg={"#fff"}
				>
					<Text fontWeight={"700"} fontSize={"sm"}>
						Top up
					</Text>
					<Grid templateColumns="repeat(3, 1fr)" gap={"2"} width={"full"}>
						{dataPlans.map((plan: Plan, id) => {
							return (
								<GridItem key={id}>
									<DataAmountCard
										itemCode={plan.item_code}
										amount={plan.amount}
										currencyTicker="₦"
										tokenTicker={"USDC"}
										plan={extractDataValue(plan.biller_name)}
										action={() => {
											onOpen();
										}}
									/>
								</GridItem>
							);
						})}
					</Grid>
				</VStack>
				<PaymentPrompt
					isOpen={isOpen}
					onClose={onClose}
					onOpen={onOpen}
					currencyTicker={"₦"}
					tokenTicker={"USDC"}
					amount={fiatAmount}
					tokenAmount={tokenAmount}
					productName={"Data"}
					feeAmount={"0"}
					billType="MOBILEDATA"
				/>
			</VStack>
		</PageWrapper>
	);
};

const Data = () => {
	return (
		<AirtimePurchaseProvider>
			<DataContent />
		</AirtimePurchaseProvider>
	);
};
export default Data;
