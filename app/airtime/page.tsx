"use client";
import AmountCard from "@/app/components/AmountCard/AmountCard";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import { PaymentPrompt } from "@/app/components/PaymentPrompt/PaymentPrompt";
import PhoneNumberInput from "@/app/components/PhoneNumberInput/PhoneNumberInput";
import {
	Button,
	Grid,
	GridItem,
	HStack,
	Input,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import React from "react";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";
import { useWallet } from "../context/WalletContext";

const AirtimeData = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { walletAddress } = useWallet();
	const {
		fiatAmount,
		setFiatAmount,
		tokenAmount,
		setTokenAmount,
		phoneNumber,
		setPhoneNumber,
	} = useAirtimePurchase();
	return (
		<PageWrapper page={"Airtime"}>
			<VStack gap={"40px"} width={"full"}>
				<PhoneNumberInput
					phoneNumber={phoneNumber}
					action={(e) => setPhoneNumber(e.target.value)}
				/>
				<VStack
					gap={"30px"}
					padding={"10px"}
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
							<AmountCard
								amount={"100"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									onOpen();
								}}
							/>
						</GridItem>
						<GridItem>
							<AmountCard
								amount={"150"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									console.log("Clicked AmountCard");
								}}
							/>
						</GridItem>
						<GridItem>
							<AmountCard
								amount={"200"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									console.log("Clicked AmountCard");
								}}
							/>
						</GridItem>
						<GridItem>
							<AmountCard
								amount={"500"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									console.log("Clicked AmountCard");
								}}
							/>
						</GridItem>
						<GridItem>
							<AmountCard
								amount={"1000"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									console.log("Clicked AmountCard");
								}}
							/>
						</GridItem>
						<GridItem>
							<AmountCard
								amount={"2000"}
								tokenAmount={"0.062"}
								ticker="₦"
								tokenTicker={"USDC"}
								action={() => {
									console.log("Clicked AmountCard");
								}}
							/>
						</GridItem>
					</Grid>
					<VStack width={"full"} alignItems={"flex-start"}>
						<HStack width={"full"} justifyContent={"space-between"}>
							<HStack gap={"10px"} borderBottom={"1px solid #cdcdcd"}>
								<Text fontSize={"lg"}>₦</Text>
								<Input
									px={0}
									border={0}
									placeholder="50 - 500,000"
									borderRadius={0}
									type="number"
									fontWeight={"600"}
									outline={0}
									_focusVisible={{ border: 0 }}
									min={"100"}
									required
									onChange={(e) => {
										setFiatAmount(parseFloat(e.target.value));
										setTokenAmount(parseFloat(e.target.value) / 1580);
									}}
								/>
							</HStack>
							<Button
								isDisabled={!walletAddress}
								bg={"rgb(16, 61, 150)"}
								borderRadius={"full"}
								color={"#fff"}
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								onClick={() => onOpen()}
							>
								Buy Airtime
							</Button>
						</HStack>
						<Text>
							<Text fontSize={"xs"}>
								{isNaN(tokenAmount) ? 0 : tokenAmount.toFixed(4)} USDC{" "}
							</Text>
						</Text>
					</VStack>
				</VStack>
				<PaymentPrompt
					isOpen={isOpen}
					onClose={onClose}
					onOpen={onOpen}
					currency="N"
					currencyTicker={"₦"}
					tokenTicker={"USDC"}
					amount={fiatAmount}
					tokenAmount={tokenAmount}
					productName={"Airtime"}
					feeAmount={"0"}
					billType="airtime"
				/>
			</VStack>
		</PageWrapper>
	);
};

const Airtime = () => {
	return (
		<AirtimePurchaseProvider>
			<AirtimeData />
		</AirtimePurchaseProvider>
	);
};
export default Airtime;
