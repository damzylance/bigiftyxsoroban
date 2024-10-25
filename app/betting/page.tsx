"use client";
import React, { useState, useCallback } from "react";
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
import { CheckCircleIcon } from "@chakra-ui/icons";
import Image from "next/image";
import axios from "axios";
import { IoCloseCircle } from "react-icons/io5";
import debounce from "lodash/debounce";
import AmountCard from "../components/AmountCard/AmountCard";
import { useWallet } from "../context/WalletContext";
import { PaymentPrompt } from "../components/PaymentPrompt/PaymentPrompt";

const Bet9jaContent = () => {
	const { walletAddress } = useWallet();
	const toast = useToast();

	const {
		fiatAmount,
		setFiatAmount,
		tokenAmount,
		setTokenAmount,
		phoneNumber,
		setPhoneNumber,
	} = useAirtimePurchase();

	const {
		isOpen: paymentIsOpen,
		onOpen: PaymentOnOpen,
		onClose: PaymentOnClose,
	} = useDisclosure();

	const [clientId, setClientId] = useState("");
	const [isValidating, setIsValidating] = useState(false);
	const [isValidated, setIsValidated] = useState(false);
	const [accountHolder, setAccountHolder] = useState("");
	const [validationToken, setValidationToken] = useState("");

	const validatePhoneNumber = (phone: string): boolean => {
		return /^[0-9]{10}$/.test(phone);
	};

	const validateBetUser = async (phone: string, id: string) => {
		if (!phone || !id) {
			return;
		}

		if (!validatePhoneNumber(phone)) {
			toast({
				title: "Invalid Phone Number",
				description: "Please enter a valid 10-digit phone number",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsValidating(true);
		try {
			const data = {
				phone: `234${phone}`,
				client_id: id,
			};

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BASE_URL2}bet/validate-customer/`,
				data
			);

			setValidationToken(response.data.token);
			setAccountHolder(`${response.data.firstName} ${response.data.lastName}`);
			setIsValidated(true);
		} catch (error: any) {
			setIsValidated(false);
			toast({
				title: error.response?.data?.error || "Error validating details",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} finally {
			setIsValidating(false);
		}
	};

	const debouncedValidate = useCallback(
		debounce((phone: string, id: string) => {
			validateBetUser(phone, id);
		}, 500),
		[]
	);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: "phone" | "clientId"
	) => {
		const value = e.target.value;
		if (field === "phone") {
			setPhoneNumber(value);
		} else {
			setClientId(value);
		}

		if (
			(field === "phone" && clientId) ||
			(field === "clientId" && phoneNumber)
		) {
			debouncedValidate(
				field === "phone" ? value : phoneNumber,
				field === "clientId" ? value : clientId
			);
		}
	};

	const togglePayment = (amount: string) => {
		if (!isValidated) {
			toast({
				title: "Account Not Validated",
				description: "Please enter valid account details",
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

	return (
		<PageWrapper page="Bet9ja">
			<VStack gap="20px" width="full">
				<VStack
					gap="10px"
					padding="10px"
					width="full"
					borderRadius="12px"
					alignItems="flex-start"
					bg="#fff"
				>
					<HStack width="full" spacing={4}>
						<Image
							alt="Bet9ja Logo"
							width={40}
							height={40}
							style={{ borderRadius: "50%" }}
							src="/images/icons/bet/bet9ja-logo.webp"
						/>
						<Text fontSize="lg" fontWeight="600">
							Bet9ja Topup
						</Text>
					</HStack>
				</VStack>

				<VStack
					gap="10px"
					padding="10px"
					width="full"
					borderRadius="12px"
					alignItems="flex-start"
					bg="#fff"
				>
					<Text fontWeight="700" fontSize="sm">
						Phone Number
					</Text>
					<Input
						placeholder="Enter phone number"
						type="tel"
						value={phoneNumber}
						onChange={(e) => handleInputChange(e, "phone")}
						size="lg"
						bg="gray.100"
						border="none"
					/>

					<Text fontWeight="700" fontSize="sm">
						Client ID
					</Text>
					<Input
						size="lg"
						bg="gray.100"
						border="none"
						type="text"
						value={clientId}
						onChange={(e) => handleInputChange(e, "clientId")}
					/>

					<HStack height="20px" spacing={2}>
						{isValidating ? (
							<Spinner size="xs" color="blue.500" />
						) : isValidated ? (
							<HStack color="green.600">
								<CheckCircleIcon />
								<Text fontSize="xs">{accountHolder}</Text>
							</HStack>
						) : phoneNumber || clientId ? (
							<HStack color="red.500">
								<IoCloseCircle />
								<Text fontSize="xs">Invalid account details</Text>
							</HStack>
						) : null}
					</HStack>
				</VStack>

				<VStack
					gap="30px"
					padding="10px"
					width="full"
					borderRadius="12px"
					alignItems="flex-start"
					bg="#fff"
				>
					<Text fontWeight="700" fontSize="sm">
						Select Amount
					</Text>
					<Grid templateColumns="repeat(3, 1fr)" gap="2" width="full">
						{["1000", "2000", "3000", "5000", "10000", "20000"].map(
							(amount) => (
								<GridItem key={amount}>
									<AmountCard
										amount={amount}
										currencyTicker="₦"
										tokenTicker="USDC"
										action={() => togglePayment(amount)}
									/>
								</GridItem>
							)
						)}
					</Grid>
					<VStack width="full" alignItems="flex-start">
						<HStack width="full" justifyContent="space-between">
							<HStack gap="10px" borderBottom="1px solid #cdcdcd">
								<Text fontSize="lg">₦</Text>
								<Input
									px={0}
									border={0}
									placeholder="50 - 500,000"
									borderRadius={0}
									type="number"
									fontWeight="600"
									outline={0}
									_focusVisible={{ border: 0 }}
									min="100"
									required
									onChange={(e) => {
										const amount = e.target.value;
										setFiatAmount(parseFloat(amount));
										setTokenAmount(parseFloat(amount) / 1700);
									}}
								/>
							</HStack>
							<Button
								isDisabled={!walletAddress || !isValidated}
								bg="rgb(16, 61, 150)"
								borderRadius="full"
								color="#fff"
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								onClick={() => togglePayment(fiatAmount.toString())}
							>
								Fund Account
							</Button>
						</HStack>
						<Text fontSize="xs">
							{isNaN(tokenAmount) ? 0 : tokenAmount.toFixed(4)} USDC
						</Text>
					</VStack>
				</VStack>
			</VStack>

			<PaymentPrompt
				isOpen={paymentIsOpen}
				onClose={PaymentOnClose}
				onOpen={PaymentOnOpen}
				currencyTicker="₦"
				tokenTicker="USDC"
				amount={fiatAmount}
				tokenAmount={tokenAmount}
				productName="Bet9ja Top up"
				feeAmount="0"
				billType="betting"
			/>
		</PageWrapper>
	);
};

const Bet9ja = () => {
	return (
		<AirtimePurchaseProvider>
			<Bet9jaContent />
		</AirtimePurchaseProvider>
	);
};

export default Bet9ja;
