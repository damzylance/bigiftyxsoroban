import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	useDisclosure,
	VStack,
	Text,
	HStack,
	Button,
	useToast,
} from "@chakra-ui/react";
import { useWallet } from "@/app/context/WalletContext";
import { useState } from "react";
import { handleSendPayment } from "@/app/utils/contractActions";
import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { buyAirtime } from "@/app/utils/serverActions";

export function PaymentPrompt(props: any) {
	const { walletAddress } = useWallet();
	const { phoneNumber, selectedProvider } = useAirtimePurchase();
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	const sendPayment = async () => {
		const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID as string;
		const tokenAddress = process.env.NEXT_PUBLIC_USDC_TOKEN_ID as string;
		const tokenAmount = Math.round(props.tokenAmount * 10 ** 7);

		setIsLoading(true);
		const tx = await handleSendPayment(
			CONTRACT_ID,
			tokenAddress,
			walletAddress,
			tokenAmount
		);
		if (tx.status === "PENDING") {
			const data = {
				bill_type: props.billType.toUpperCase(),
				item_code: selectedProvider?.itemCode,
				biller_code: selectedProvider?.billerCode,
				amount: props.amount,
				crypto_amount: parseFloat(props.tokenAmount).toFixed(4),
				customer: phoneNumber,
				chain: "usdc",
				wallet_address: walletAddress,
				transaction_hash: tx.txhash,
				country: "NG",
			};
			console.log(data);
			const purchaseResponse: any = await buyAirtime(data);
			if (purchaseResponse?.status === 200) {
				// airtime purchased successfully
				toast({
					title: "Airtime purchased succesfully",
					status: "success",
				});
				setIsLoading(false);
				props.onClose();
			} else {
				setIsLoading(false);
				toast({ title: "Error occured ", status: "warning" });
				props.onClose();
			}
		}
	};
	return (
		<>
			<Drawer isOpen={props.isOpen} placement="bottom" onClose={props.onClose}>
				<DrawerOverlay />
				<DrawerContent
					borderRadius={"12px 12px 0 0"}
					width={"600px"}
					margin={"auto"}
					maxWidth={"600px"}
				>
					<DrawerCloseButton />

					<DrawerBody>
						<VStack width={"full"} p={"20px 10px"} gap={"20px"}>
							<VStack>
								<Text fontSize={"x-large"} fontWeight={"600"}>
									{props.currencyTicker}
									{props.amount}
								</Text>
								<Text fontSize={"sm"} fontWeight={"600"}>
									{props.tokenTicker} {parseFloat(props.tokenAmount).toFixed(4)}
								</Text>
							</VStack>

							<VStack width={"full"} gap={"10px"}>
								<HStack width={"full"} justifyContent={"space-between"}>
									<Text fontSize={"sm"}>Product Name</Text>
									<Text fontSize={"sm"}>{props.productName}</Text>
								</HStack>
								<HStack width={"full"} justifyContent={"space-between"}>
									<Text fontSize={"sm"}>Amount</Text>
									<Text fontSize={"sm"}>{props.amount}</Text>
								</HStack>
								<HStack width={"full"} justifyContent={"space-between"}>
									<Text fontSize={"sm"}>Token Amount</Text>
									<Text fontSize={"sm"}>
										{parseFloat(props.tokenAmount).toFixed(4)}
									</Text>
								</HStack>
								<HStack width={"full"} justifyContent={"space-between"}>
									<Text fontSize={"sm"}>Fee</Text>
									<Text fontSize={"sm"}>{props.feeAmount}</Text>
								</HStack>
							</VStack>
							<Button
								width={"full"}
								bg={"rgb(16, 61, 150)"}
								borderRadius={"full"}
								color={"#fff"}
								mt={"20px"}
								size={"lg"}
								isLoading={isLoading}
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								fontWeight={"700"}
								onClick={() => {
									sendPayment();
								}}
							>
								Buy
							</Button>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
