"use client";

import DataAmountCard from "@/app/components/DataAmountCard/DataAmountCard";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
// import { PaymentPrompt } from "@/app/components/PaymentPrompt/PaymentPrompt";
import PhoneNumberInput from "@/app/components/PhoneNumberInput/PhoneNumberInput";
import { Grid, GridItem, Text, useDisclosure, VStack } from "@chakra-ui/react";
import React from "react";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";

const Data = () => {
	const { onOpen } = useDisclosure();
	const { phoneNumber, setPhoneNumber } = useAirtimePurchase();
	return (
		<AirtimePurchaseProvider>
			<PageWrapper page={"Mobile Data"}>
				<VStack gap={"40px"} width={"full"}>
					<PhoneNumberInput
						phoneNumber={phoneNumber}
						action={(e) => setPhoneNumber(e.target.value)}
					/>
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
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
							<GridItem>
								<DataAmountCard
									amount={"100"}
									tokenAmount={"0.062"}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={() => {
										onOpen();
									}}
									plan="100MB"
								/>
							</GridItem>
						</Grid>
					</VStack>
					{/* <PaymentPrompt
						isOpen={isOpen}
						onClose={onClose}
						currencyTicker={"₦"}
						tokenTicker={"USDC"}
						amount={1000}
						tokenAmount={0.61}
						productName={"Airtime"}
						feeAmount={"0"}
					/> */}
				</VStack>
			</PageWrapper>
		</AirtimePurchaseProvider>
	);
};

export default Data;
