import React, { useState } from "react";
import {
	Container,
	VStack,
	Text,
	Button,
	Input,
	useToast,
} from "@chakra-ui/react";
import { ReactConfetti } from "react-confetti";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useWallet } from "@/app/context/WalletContext";

type RedeemData = {
	code: string;
	wallet: string;
};

function Reedeem() {
	const { walletAddress } = useWallet();

	const { register, handleSubmit } = useForm<RedeemData>();
	const toast = useToast();
	const [confetti, setConfetti] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	const handleRedeem = async (data: RedeemData) => {
		setIsLoading(true);
		data.wallet = walletAddress;
		axios
			.post(`${process.env.NEXT_PUBLIC_BASE_URL}/giftcard/redeem/`, data)
			.then((response) => {
				setIsLoading(false);
				setConfetti(true);
				toast({ title: "Giftcard redeemed successfully", status: "success" });
			})
			.catch((error) => {
				setIsLoading(false);
				toast({
					title:
						error?.response?.data?.error ||
						error?.message ||
						"An error occurred",
					status: "warning",
				});
			});
	};

	return (
		<VStack>
			<Container
				py="52px"
				color={"brand.700"}
				borderRadius={"2xl"}
				bg={"brand.50"}
				mt="10"
				mb="5"
			>
				{confetti && (
					<ReactConfetti
						width={window.innerWidth}
						height={window.innerHeight}
					/>
				)}
				<VStack gap={"5"} alignItems="flex-start" width={"full"}>
					<Text>Enter Your Gift Card Code</Text>
					<form style={{ width: "100%" }} onSubmit={handleSubmit(handleRedeem)}>
						<VStack width={"full"} gap={"5"} alignItems="center">
							<Input
								type={"text"}
								size={"lg"}
								width="full"
								placeholder={"Paste code here"}
								required
								_focusVisible={{
									outline: "none",
									border: "none",
								}}
								outline={"none"}
								bg={"#dfe6f2"}
								color={"#373737"}
								border={"0px"}
								borderRadius={"12px"}
								{...register("code")}
							/>
							<Button
								width={"full"}
								isDisabled={!walletAddress}
								type="submit"
								borderRadius={"full"}
								color={"#fff"}
								bg={"rgb(16, 61, 150)"}
								_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
								variant={"solid"}
								isLoading={isLoading}
							>
								Redeem
							</Button>
						</VStack>
					</form>
				</VStack>
			</Container>
			<Text
				mt={0}
				fontSize={"sm"}
				color={"brand.500"}
				width={"full"}
				cursor={"pointer"}
				textAlign={"center"}
				textDecor={"underline"}
				_hover={{ color: "brand.300" }}
				onClick={() => {
					setShowHistory(!showHistory);
				}}
			>
				{showHistory ? "Hide History" : "Show History"}
			</Text>
		</VStack>
	);
}

export default Reedeem;
