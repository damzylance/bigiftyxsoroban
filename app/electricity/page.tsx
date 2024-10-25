"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import {
	Button,
	Grid,
	GridItem,
	HStack,
	Input,
	Text,
	useDisclosure,
	VStack,
	Spinner,
	useToast,
} from "@chakra-ui/react";
import { ArrowForwardIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { PhoneNumberInputModal } from "../components/PhoneNumberInput/PhoneNumberInput";
import Image from "next/image";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import debounce from "lodash/debounce";
import AmountCard from "../components/AmountCard/AmountCard";
import { useWallet } from "../context/WalletContext";
import { PaymentPrompt } from "../components/PaymentPrompt/PaymentPrompt";

const ElectricityContent = () => {
	const { walletAddress } = useWallet();
	const toast = useToast();

	const {
		fiatAmount,
		setFiatAmount,
		tokenAmount,
		setTokenAmount,
		email,
		setEmail,
		phoneNumber,
		setPhoneNumber,
		setSelectedProvider,
		selectedProvider,
	} = useAirtimePurchase();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: paymentIsOpen,
		onOpen: PaymentOnOpen,
		onClose: PaymentOnClose,
	} = useDisclosure();

	const [customerValidation, setCustomerValidation] = useState({
		isValid: false,
		customerDetails: "",
		error: "",
	});
	const [isValidating, setIsValidating] = useState(false);

	const validateEmail = (email: string): boolean => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Core validation function
	const validateCustomer = async (number: string) => {
		if (number.length < 10) {
			setCustomerValidation({
				isValid: false,
				customerDetails: "",
				error: "Meter number must be at least 10 digits",
			});
			return;
		}

		setIsValidating(true);
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BASE_URL2}validate-bill-service/?item-code=${selectedProvider?.itemCode}&biller-code=${selectedProvider?.billerCode}&customer=${number}`
			);

			if (response?.data?.data?.response_message === "Successful") {
				setCustomerValidation({
					isValid: true,
					customerDetails: response?.data?.data.name,
					error: "",
				});
			} else {
				setCustomerValidation({
					isValid: false,
					customerDetails: "",
					error: "Invalid meter number",
				});
			}
		} catch (error) {
			setCustomerValidation({
				isValid: false,
				customerDetails: "",
				error: "Failed to validate meter number",
			});
		} finally {
			setIsValidating(false);
		}
	};

	// Create debounced version
	const debouncedValidate = useCallback(
		debounce((number) => {
			validateCustomer(number);
		}, 500),
		[selectedProvider]
	);

	// Cleanup on unmount or provider change
	useEffect(() => {
		return () => {
			debouncedValidate.cancel();
		};
	}, [debouncedValidate]);

	// Reset validation when provider changes
	useEffect(() => {
		setCustomerValidation({
			isValid: false,
			customerDetails: "",
			error: "",
		});
		// Re-validate if there's a meter number
		if (phoneNumber.length >= 10) {
			validateCustomer(phoneNumber);
		}
	}, [selectedProvider]);

	// Handle input change
	const handleMeterNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newNumber = e.target.value;
		setPhoneNumber(newNumber);
		debouncedValidate(newNumber);
	};

	const togglePayment = (amount: string) => {
		if (!customerValidation.isValid) {
			toast({
				title: "Invalid Meter Number",
				description: "Please enter a valid meter number",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!validateEmail(email)) {
			toast({
				title: "Invalid Email",
				description: "Please enter a valid email address",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!walletAddress) {
			toast({
				title: "Wallet Not Connected",
				description: "Please connect your wallet to continue",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setFiatAmount(parseFloat(amount));
		setTokenAmount(parseFloat(amount) / 1700);
		PaymentOnOpen();
	};

	const supportedProviders = [
		{
			name: "IKEDC",
			logo: "/images/icons/utilities/ikedc.png",
			id: "1",
			billerCode: "BIL113",
			itemCode: "UB159",
		},
		{
			name: "EKEDC",
			logo: "/images/icons/utilities/ekedc.jpg",
			id: "2",
			billerCode: "BIL112",
			itemCode: "UB157",
		},
		{
			name: "ABUJA DISCO",
			logo: "/images/icons/utilities/abuja.png",
			id: "3",
			billerCode: "BIL204",
			itemCode: "UB584",
		},
		{
			name: "IBADAN DISCO",
			logo: "/images/icons/utilities/ibadan.png",
			id: "4",
			billerCode: "BIL114",
			itemCode: "UB161",
		},
		{
			name: "KANO DISCO",
			logo: "/images/icons/utilities/kano.jpeg",
			id: "5",
			billerCode: "BIL120",
			itemCode: "UB169",
		},
		{
			name: "KADUNA DISCO",
			logo: "/images/icons/utilities/kaduna.png",
			id: "6",
			billerCode: "BIL119",
			itemCode: "UB602",
		},
		{
			name: "ENUGU DISCO",
			logo: "/images/icons/utilities/enugu.png",
			id: "7",
			billerCode: "BIL115",
			itemCode: "UB163",
		},
	];

	useEffect(() => {
		setSelectedProvider(supportedProviders[0]);
	}, []);

	return (
		<PageWrapper page="Electricity">
			<VStack gap={"20px"} width={"full"}>
				<VStack
					gap={"10px"}
					padding={"10px"}
					width={"full"}
					borderRadius={"12px"}
					alignItems={"flex-start"}
					bg={"#fff"}
				>
					<Text fontWeight={"700"} fontSize={"sm"}>
						Select Provider
					</Text>
					<HStack
						width={"full"}
						justifyContent={"space-between"}
						bg={"#dfe6f2"}
						p={"5px 10px"}
						borderRadius={"12px"}
						cursor={"pointer"}
						onClick={() => onOpen()}
					>
						<HStack>
							<Image
								alt={`${selectedProvider?.name}`}
								width={40}
								height={40}
								style={{ borderRadius: "50%" }}
								src={selectedProvider?.logo || ""}
							/>
							<Text fontSize={"sm"} fontWeight={"600"}>
								{selectedProvider?.name} Prepaid
							</Text>
						</HStack>
						<ArrowForwardIcon />
					</HStack>
				</VStack>
				<VStack
					gap={"10px"}
					padding={"10px"}
					width={"full"}
					borderRadius={"12px"}
					alignItems={"flex-start"}
					bg={"#fff"}
				>
					<Text fontWeight={"700"} fontSize={"sm"}>
						Meter Number
					</Text>
					<Input
						placeholder="Enter meter number"
						type="text"
						value={phoneNumber}
						size="lg"
						bg="gray.100"
						border="none"
						onChange={handleMeterNumberChange}
					/>
					<HStack spacing={2}>
						{isValidating ? (
							<Spinner size="xs" color="blue.500" />
						) : customerValidation.isValid ? (
							<HStack color={"green.500"}>
								<CheckCircleIcon />
								<Text fontSize={"xs"}>
									{customerValidation.customerDetails}
								</Text>
							</HStack>
						) : customerValidation.error ? (
							<HStack color={"red.500"}>
								<IoCloseCircle />
								<Text fontSize={"xs"}>{customerValidation.error}</Text>
							</HStack>
						) : null}
					</HStack>

					<Text fontWeight={"700"} fontSize={"sm"}>
						Email To Receive Token
					</Text>
					<Input
						placeholder="you@email.com"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						size="lg"
						bg="gray.100"
						border="none"
					/>
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
						Select Amount
					</Text>
					<Grid templateColumns="repeat(3, 1fr)" gap={"2"} width={"full"}>
						{["1000", "2000", "3000", "5000", "10000", "20000"].map(
							(amount) => (
								<GridItem key={amount}>
									<AmountCard
										amount={amount}
										currencyTicker="₦"
										tokenTicker={"USDC"}
										action={() => togglePayment(amount)}
									/>
								</GridItem>
							)
						)}
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
										const amount = e.target.value;
										setFiatAmount(parseFloat(amount));
										setTokenAmount(parseFloat(amount) / 1700);
									}}
								/>
							</HStack>
							<Button
								isDisabled={!walletAddress || !customerValidation.isValid}
								bg={"rgb(16, 61, 150)"}
								borderRadius={"full"}
								color={"#fff"}
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								onClick={() => togglePayment(fiatAmount.toString())}
							>
								Buy Electricity
							</Button>
						</HStack>
						<Text fontSize={"xs"}>
							{isNaN(tokenAmount) ? 0 : tokenAmount.toFixed(4)} USDC{" "}
						</Text>
					</VStack>
				</VStack>
			</VStack>
			<PhoneNumberInputModal
				isOpen={isOpen}
				onClose={onClose}
				supportedNetworks={supportedProviders}
			/>
			<PaymentPrompt
				isOpen={paymentIsOpen}
				onClose={PaymentOnClose}
				onOpen={PaymentOnOpen}
				currencyTicker={"₦"}
				tokenTicker={"USDC"}
				amount={fiatAmount}
				tokenAmount={tokenAmount}
				productName={"Electricity"}
				feeAmount={"0"}
				billType="electricity"
			/>
		</PageWrapper>
	);
};

const Electricity = () => {
	return (
		<AirtimePurchaseProvider>
			<ElectricityContent />
		</AirtimePurchaseProvider>
	);
};

export default Electricity;
