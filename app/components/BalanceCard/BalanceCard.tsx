import { useWallet } from "@/app/context/WalletContext";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { Networks, SorobanRpc, Horizon } from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const BalanceCard = (props: Props) => {
	const { walletAddress } = useWallet();
	const [balance, setBalance] = useState("0");
	const router = useRouter();
	const getBalance = async () => {
		if (walletAddress) {
			const HORIZON_URL = "https://horizon-testnet.stellar.org";
			const server = new Horizon.Server(HORIZON_URL);
			try {
				// Fetch account details to get balances
				const accountDetails = await server.loadAccount(walletAddress);
				console.log("balance Details:", accountDetails.balances);

				// Log USDC balances
				console.log(accountDetails.balances[0].balance);
				setBalance(parseFloat(accountDetails.balances[0].balance).toFixed(2));
			} catch (error) {
				console.error("Error fetching account information:", error);
			}
		}
	};
	getBalance();
	return (
		<VStack
			padding={"10px 20px"}
			borderRadius={"12px"}
			width={"full"}
			bg={"rgb(16, 61, 150)"}
			color={"#fff"}
			gap={"20px"}
		>
			<HStack width={"full"} justifyContent={"space-between"}>
				<Text fontSize={"sm"}>Available Balance</Text>
				<HStack
					gap={"4px"}
					cursor={"pointer"}
					onClick={() => router.push("/history")}
				>
					<Text fontSize={"xs"} p={0}>
						Transaction History
					</Text>
					<ArrowForwardIcon fontSize={"14px"} />
				</HStack>
			</HStack>
			<HStack width={"full"}>
				<Text fontWeight={"700"} fontSize={"xl"}>
					{balance}
				</Text>
			</HStack>
		</VStack>
	);
};

export default BalanceCard;
