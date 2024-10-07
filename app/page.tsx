"use client";
import {
	Box,
	Text,
	VStack,
	Flex,
	HStack,
	Grid,
	GridItem,
	Spinner,
} from "@chakra-ui/react";

import { FaFootballBall, FaGifts, FaGlobe, FaMobileAlt } from "react-icons/fa";
import BalanceCard from "./components/BalanceCard/BalanceCard";
import TransactionRow from "./components/TransactionRow/TransactionRow";
import GiftCardServiceItem from "./components/ServiceItem/GiftCardServiceItem";
import { MdCardGiftcard } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import ServiceItem from "./components/ServiceItem/ServiceItem";

import { FcElectricity } from "react-icons/fc";
import { FaTv } from "react-icons/fa6";
import Header from "./components/Header/Header";
import { useEffect, useState } from "react";
import { useWallet } from "./context/WalletContext";
import axios from "axios";

export default function Home() {
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const { walletAddress } = useWallet();

	useEffect(() => {
		if (walletAddress) {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/?search=${walletAddress}&limit=2`
				)
				.then((response) => {
					setIsLoading(false);
					setTransactions(response.data.results);
					console.log(response);
					// rate = parseFloat(response.data);
				})
				.catch((error) => {
					setIsLoading(false);
					console.log(error);
				});
		} else {
			setTransactions([]);
			setIsLoading(false);
		}
		// fetchRates();
	}, [walletAddress]);

	return (
		<Flex
			direction="column"
			h="100vh"
			w="full"
			maxW={"650px"}
			position="relative"
			margin={"auto"}
		>
			{/* Fixed Header */}
			<Header />

			{/* Scrollable Content */}
			<Box
				as="main"
				flex="1"
				p={4}
				bg="gray.100"
				mt="60px" // Adjusted to account for header height
				overflowY="auto"
			>
				<Box height={"800px"} width={"full"} maxW={"600px"} mx={"auto"}>
					{/*Child component */}
					<VStack width={"full"} gap={"20px"}>
						{/* Balance card */}
						<BalanceCard />
						{/* Recent Transactions */}
						<VStack
							width={"full"}
							p={"20px"}
							alignItems={"center"}
							borderRadius={"20px"}
							bg={"#fff"}
						>
							{isLoading ? (
								<Spinner />
							) : transactions.length > 0 ? (
								<>
									{transactions.map((transaction: any) => {
										return (
											<TransactionRow
												key={transaction.id}
												amount={transaction.amount.toFixed(0)}
												tokenAmount={transaction.crypto_amount}
												type={transaction.bill_type}
												status={"success" || transaction.status}
												date={transaction.time}
											/>
										);
									})}
								</>
							) : (
								<Text fontSize={"xs"}>No recent transactions </Text>
							)}
						</VStack>
						{/* Gift Card Menus */}
						<HStack
							width={"full"}
							bg={"#fff"}
							padding={"20px"}
							justifyContent={"space-around"}
							borderRadius={"20px"}
						>
							<GiftCardServiceItem
								icon={MdCardGiftcard}
								name={"Create Giftcard"}
								url={"create"}
							/>
							<GiftCardServiceItem
								icon={BsCash}
								name={"Redeem"}
								url={"redeem"}
							/>
							<GiftCardServiceItem
								icon={FaGifts}
								name={"My Giftcards"}
								url={"my-cards"}
							/>
						</HStack>
						{/* Utility Menus */}
						<Grid templateColumns="repeat(4, 1fr)" columnGap={20} rowGap={10}>
							<GridItem>
								<ServiceItem icon={FaMobileAlt} name={"Airtime"} />
							</GridItem>
							<GridItem>
								<ServiceItem icon={FaGlobe} name={"Data"} />
							</GridItem>
							<GridItem>
								<ServiceItem icon={FcElectricity} name={"Electricity"} />
							</GridItem>
							<GridItem>
								<ServiceItem icon={FaTv} name={"Cable"} />
							</GridItem>
							<GridItem>
								<ServiceItem icon={FaFootballBall} name={"Bet"} />
							</GridItem>
						</Grid>
					</VStack>
					{/*Child component */}
				</Box>
			</Box>

			{/* Fixed Bottom Navigation */}
			{/* <HStack
				as="footer"
				bg="white"
				p={4}
				justify="space-around"
				borderTop="1px"
				borderColor="gray.200"
				position="fixed"
				bottom={0}
				left={0}
				right={0}
				zIndex={10}
			>
				<VStack
					onClick={() => router.push("/")}
					cursor="pointer"
					color={pathName === "/" ? "green.500" : "gray.500"}
				>
					<FaHome />
					<Text fontSize="xs">Home</Text>
				</VStack>

				<VStack
					onClick={() => router.push("/wallet")}
					cursor="pointer"
					color={pathName === "/wallet" ? "green.500" : "gray.500"}
				>
					<FaWallet />
					<Text fontSize="xs">Wallet</Text>
				</VStack>

				<VStack
					onClick={() => router.push("/profile")}
					cursor="pointer"
					color={pathName === "/profile" ? "green.500" : "gray.500"}
				>
					<FaUser />
					<Text fontSize="xs">Profile</Text>
				</VStack>
			</HStack> */}
		</Flex>
	);
}
