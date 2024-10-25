"use client";
import React, { useEffect, useState } from "react";
import {
	Box,
	VStack,
	HStack,
	Text,
	Input,
	Grid,
	GridItem,
	useDisclosure,
	Image,
	Button,
	Alert,
	AlertIcon,
	AlertDescription,
	Spinner,
	useToast,
} from "@chakra-ui/react";
import { CheckCircleIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { IoCloseCircle } from "react-icons/io5";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import { PhoneNumberInputModal } from "../components/PhoneNumberInput/PhoneNumberInput";
import { PaymentPrompt } from "../components/PaymentPrompt/PaymentPrompt";
import { useWallet } from "../context/WalletContext";
import {
	AirtimePurchaseProvider,
	useAirtimePurchase,
} from "../context/AirtimePurchaseContext";

// Types
interface Provider {
	name: string;
	logo: string;
	id: string;
	billerCode: string;
	itemCode: string;
}

interface Plan {
	item_code: string;
	biller_code: string;
	biller_name: string;
	amount: string;
}

const SUPPORTED_PROVIDERS: Provider[] = [
	{
		name: "DSTV",
		logo: "/images/icons/cables/dstv.png",
		id: "1",
		billerCode: "BIL121",
		itemCode: "CB177",
	},
	{
		name: "GOTV",
		logo: "/images/icons/cables/gotv.png",
		id: "2",
		billerCode: "BIL122",
		itemCode: "CB188",
	},
	{
		name: "STARTIMES",
		logo: "/images/icons/cables/startimes.png",
		id: "3",
		billerCode: "BIL123",
		itemCode: "CB188",
	},
];

const TVContent = () => {
	// Context and hooks
	const {
		fiatAmount,
		setFiatAmount,
		tokenAmount,
		setTokenAmount,
		email,
		setEmail,
		phoneNumber,
		setPhoneNumber,
		selectedProvider,
		setSelectedProvider,
	} = useAirtimePurchase();
	const { walletAddress } = useWallet();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: paymentIsOpen,
		onOpen: paymentOnOpen,
		onClose: paymentOnClose,
	} = useDisclosure();
	const toast = useToast();

	// State
	const [isLoading, setIsLoading] = useState(false);
	const [isValidating, setIsValidating] = useState(false);
	const [plans, setPlans] = useState<Plan[]>([]);
	const [customerValidation, setCustomerValidation] = useState({
		isValid: false,
		customerDetails: "",
		error: "",
	});

	const validateEmail = (email: string): boolean => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handlePaymentClick = (plan: Plan) => {
		if (!customerValidation.isValid) {
			toast({
				title: "Invalid Smart Card",
				description: "Please enter a valid smart card number",
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

		setFiatAmount(parseFloat(plan.amount));
		setTokenAmount(parseFloat(plan.amount) / 1700);
		paymentOnOpen();
	};

	const fetchPlans = async () => {
		if (!selectedProvider) return;

		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL2}v2/get-bill-info/?biller_code=${selectedProvider.billerCode}`
			);

			if (!response.ok) throw new Error("Failed to fetch plans");

			const data = await response.json();
			setPlans(data.data);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to load subscription plans",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const validateCustomer = async (number: string) => {
		if (number.length < 10) {
			setCustomerValidation({
				isValid: false,
				customerDetails: "",
				error: "Smart card number must be at least 10 digits",
			});
			return;
		}

		setIsValidating(true);
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL2}validate-bill-service/?item-code=${selectedProvider?.itemCode}&biller-code=${selectedProvider?.billerCode}&customer=${number}`
			);

			const data = await response.json();

			if (data?.data?.response_message === "Successful") {
				setCustomerValidation({
					isValid: true,
					customerDetails: data.data.name,
					error: "",
				});
			} else {
				setCustomerValidation({
					isValid: false,
					customerDetails: "",
					error: "Invalid smart card number",
				});
			}
		} catch (error) {
			setCustomerValidation({
				isValid: false,
				customerDetails: "",
				error: "Failed to validate smart card",
			});
		} finally {
			setIsValidating(false);
		}
	};

	// Reset validation when provider changes
	useEffect(() => {
		setCustomerValidation({
			isValid: false,
			customerDetails: "",
			error: "",
		});
		// Re-validate if there's a phone number
		if (phoneNumber.length >= 10) {
			validateCustomer(phoneNumber);
		}
	}, [selectedProvider]);

	useEffect(() => {
		setSelectedProvider(SUPPORTED_PROVIDERS[0]);
	}, []);

	useEffect(() => {
		fetchPlans();
	}, [selectedProvider]);

	return (
		<PageWrapper page="TV">
			<VStack spacing={6} width="full">
				{/* Provider Selection */}
				<Box width="full" bg="white" borderRadius="xl" p={4}>
					<VStack align="flex-start" spacing={3}>
						<Text fontWeight="bold" fontSize="sm">
							Select Provider
						</Text>
						<HStack
							width="full"
							justifyContent="space-between"
							bg="gray.100"
							p={3}
							borderRadius="xl"
							cursor="pointer"
							onClick={onOpen}
						>
							<HStack>
								<Image
									alt={selectedProvider?.name}
									width="40px"
									height="40px"
									borderRadius="full"
									src={selectedProvider?.logo}
								/>
								<Text fontSize="sm" fontWeight="semibold">
									{selectedProvider?.name}
								</Text>
							</HStack>
							<ArrowForwardIcon />
						</HStack>
					</VStack>
				</Box>

				{/* Smart Card Input */}
				<Box width="full" bg="white" borderRadius="xl" p={4}>
					<VStack align="flex-start" spacing={3}>
						<Text fontWeight="bold" fontSize="sm">
							Smart Card Number
						</Text>
						<Input
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							onBlur={(e) => validateCustomer(e.target.value)}
							placeholder="Enter smart card number"
							size="lg"
							bg="gray.100"
							border="none"
							_focus={{ border: "none" }}
							isInvalid={!customerValidation.isValid && !!phoneNumber}
						/>
						<HStack spacing={2}>
							{isValidating ? (
								<Spinner size="xs" color="blue.500" />
							) : customerValidation.isValid ? (
								<HStack color="green.500">
									<CheckCircleIcon />
									<Text fontSize="xs">
										{customerValidation.customerDetails}
									</Text>
								</HStack>
							) : customerValidation.error ? (
								<HStack color="red.500">
									<IoCloseCircle />
									<Text fontSize="xs">{customerValidation.error}</Text>
								</HStack>
							) : null}
						</HStack>

						<Text fontWeight="bold" fontSize="sm">
							Email Address
						</Text>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@email.com"
							size="lg"
							bg="gray.100"
							border="none"
							_focus={{ border: "none" }}
							type="email"
						/>
					</VStack>
				</Box>

				{/* Plans */}
				<Box width="full" bg="white" borderRadius="xl" p={4}>
					<Text fontWeight="bold" fontSize="sm" mb={6}>
						Select Plan
					</Text>

					{isLoading ? (
						<VStack py={8}>
							<Spinner size="xl" color="blue.500" />
						</VStack>
					) : (
						<Grid templateColumns="repeat(2, 1fr)" gap={2} width={"full"}>
							{plans.map((plan: Plan) => (
								<GridItem key={plan.item_code}>
									<Box
										onClick={() => handlePaymentClick(plan)}
										width="full"
										height="auto"
										p={4}
										bg="gray.100"
										_hover={{ bg: "gray.200" }}
										display="flex"
										flexDirection="column"
										alignItems="flex-start"
										borderRadius={"12px"}
									>
										<Text fontSize="lg" fontWeight="bold">
											₦{plan.amount}
										</Text>
										<Text fontSize="sm" color="gray.600">
											{plan.biller_name}
										</Text>
									</Box>
								</GridItem>
							))}
						</Grid>
					)}
				</Box>

				{/* Modals */}
				<PhoneNumberInputModal
					isOpen={isOpen}
					onClose={onClose}
					supportedNetworks={SUPPORTED_PROVIDERS}
				/>

				<PaymentPrompt
					isOpen={paymentIsOpen}
					onClose={paymentOnClose}
					onOpen={paymentOnOpen}
					currencyTicker="₦"
					tokenTicker="USDC"
					amount={fiatAmount}
					tokenAmount={tokenAmount}
					productName="TV"
					feeAmount="0"
					billType="tv"
				/>
			</VStack>
		</PageWrapper>
	);
};

const TV = () => {
	return (
		<AirtimePurchaseProvider>
			<TVContent />
		</AirtimePurchaseProvider>
	);
};

export default TV;
