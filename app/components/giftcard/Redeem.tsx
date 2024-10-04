import React, { useEffect, useState } from "react";
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
function Reedeem() {
	const { walletAddress } = useWallet();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const toast = useToast();
	const [confetti, setConfitti] = useState();
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [showHistory, setShowHistory] = useState(false);

	const handleRedeem = async (data: any) => {
		setIsLoading(true);
		data.wallet = walletAddress;
		axios
			.post(`${process.env.NEXT_PUBLIC_BASE_URL}/giftcard/redeem/`, data)
			.then((response) => {
				setIsLoading(false);
				console.log(response);
				toast({ title: "Giftcard redeemed successfully", status: "success" });
			})
			.catch((error) => {
				setIsLoading(false);
				toast({
					title:
						error?.response?.data?.error ||
						error?.message ||
						"An error occured",
					status: "warning",
				});
				console.log(error);
			});
		//handle redeeming
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
					<ReactConfetti width={windowSize.width} height={windowSize.height} />
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
								Reedem
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
			{/* {showHistory && (
        <Container mt={"10px"}>
          <VStack width={"full"} alignItems={"flex-start"}>
            {history.length > 0
              ? history.reverse().map((transaction) => {
                  return (
                    <HStack
                      padding={"24px"}
                      borderRadius={"10px"}
                      width={"full"}
                      justifyContent={"space-between"}
                      bg={"#fff"}
                      boxShadow={"0px 1px 4px 0px rgba(0, 0, 0, 0.10)"}
                      color={"#050505"}
                    >
                      <Text fontSize={"sm"}>{transaction.code}</Text>
                      <Text fontSize={"sm"}>{`${new Date(
                        transaction.redemption_date
                      ).toLocaleDateString()}`}</Text>
                    </HStack>
                  );
                })
              : "No transaction history"}
          </VStack>
        </Container>
      )} */}
		</VStack>
	);
}

export default Reedeem;

// Naira investment pool
// Money africa (MONI) investment pool
// Gamified saving pool to naira savings pool
//
