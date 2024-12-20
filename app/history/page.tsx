"use client";
import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper/PageWrapper";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import TransactionRow from "../components/TransactionRow/TransactionRow";
import axios from "axios";
import { useWallet } from "../context/WalletContext";

type TransactionRowType = {
	id: string;
	amount: number;
	crypto_amount: string;
	bill_type: string;
	status: "success" | "pending" | "failed"; // Assuming possible statuses
	time: string; // The date field
};

const TransactionHistory = () => {
	const { walletAddress } = useWallet();
	const [isLoading, setIsloading] = useState(true);
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		if (walletAddress) {
			axios
				.get(`${process.env.NEXT_PUBLIC_BASE_URL}/transactions/`)
				.then((response) => {
					setIsloading(false);
					setTransactions(response.data.results);
					// rate = parseFloat(response.data);
				})
				.catch((error) => {
					setIsloading(false);
					console.log(error);
				});
		} else {
			setIsloading(false);
		}
		// fetchRates();
	}, [walletAddress]);
	return (
		<PageWrapper page={"Transactions"}>
			<VStack borderRadius={"12px"} p={"10px"} width={"full"} bg={"#fff"}>
				{isLoading ? (
					<Spinner />
				) : transactions.length > 0 ? (
					<>
						{transactions.map((transaction: TransactionRowType) => {
							return (
								<TransactionRow
									key={transaction.id}
									amount={transaction.amount.toFixed(0)}
									tokenAmount={transaction.crypto_amount}
									type={transaction.bill_type}
									status={transaction.status}
									date={transaction.time}
								/>
							);
						})}
					</>
				) : (
					<Text fontSize={"xs"}>No transactions </Text>
				)}
			</VStack>
		</PageWrapper>
	);
};

export default TransactionHistory;
