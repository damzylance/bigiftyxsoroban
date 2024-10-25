"use client";
import React from "react";
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
import AmountCard from "@/app/components/AmountCard/AmountCard";
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import { PaymentPrompt } from "@/app/components/PaymentPrompt/PaymentPrompt";
import PhoneNumberInput from "@/app/components/PhoneNumberInput/PhoneNumberInput";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";
import { useWallet } from "../context/WalletContext";
import { usePhoneValidation } from "../utils/hooks/customValidation";

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

	const supportedNetworks = [
		{
			name: "MTN",
			logo: "/images/icons/mobileproviders/mtnLogo.png",
			id: "1",
			billerCode: "BIL099",
			itemCode: "AT099",
		},
		{
			name: "GLO",
			logo: "/images/icons/mobileproviders/gloLogo.png",
			id: "2",
			billerCode: "102",
			itemCode: "AT133",
		},
		{
			name: "Airtel",
			logo: "/images/icons/mobileproviders/airtelLogo.png",
			id: "3",
			billerCode: "BIL100",
			itemCode: "AT100",
		},
		{
			name: "9Mobile",
			logo: "/images/icons/mobileproviders/9mobileLogo.jpeg",
			id: "4",
			billerCode: "BIL103",
			itemCode: "AT134",
		},
	];

	// const { errors, isFormValid } = useAirtimePurchaseValidation();
	// OR use individual validation hooks
	const { error: phoneNumberError } = usePhoneValidation();

	const isValid = !phoneNumberError && walletAddress;

	const handlePaymentPrompt = () => {
		if (isValid) {
			onOpen();
		}
	};

	return (
		<PageWrapper page={"Airtime"}>
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
						{[100, 150, 200, 500, 1000, 2000].map((amount) => (
							<GridItem key={amount}>
								<AmountCard
									amount={amount.toString()}
									currencyTicker="₦"
									tokenTicker={"USDC"}
									action={handlePaymentPrompt}
								/>
							</GridItem>
						))}
					</Grid>

					<VStack width={"full"} alignItems={"flex-start"}>
						<HStack width={"full"} justifyContent={"space-between"}>
							<HStack
								gap={"10px"}
								borderBottom={"1px solid #cdcdcd"}
								width={"160px"}
							>
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
									min={50}
									max={500000}
									required
									onChange={(e) => {
										const value = parseFloat(e.target.value);
										setFiatAmount(value);
										setTokenAmount(value / 1580);
									}}
								/>
							</HStack>
							<Button
								isDisabled={!isValid}
								bg={"rgb(16, 61, 150)"}
								borderRadius={"full"}
								color={"#fff"}
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								onClick={handlePaymentPrompt}
							>
								Buy Airtime
							</Button>
						</HStack>

						<Text fontSize={"xs"}>
							{isNaN(tokenAmount) ? 0 : tokenAmount.toFixed(4)} USDC{" "}
						</Text>
					</VStack>
				</VStack>

				{isValid && (
					<PaymentPrompt
						isOpen={isOpen}
						onClose={onClose}
						onOpen={onOpen}
						currencyTicker={"₦"}
						tokenTicker={"USDC"}
						amount={fiatAmount}
						tokenAmount={tokenAmount}
						productName={"Airtime"}
						feeAmount={"0"}
						billType="airtime"
					/>
				)}
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
