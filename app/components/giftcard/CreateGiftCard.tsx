import React, { useRef, useState } from "react";
import {
	Box,
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	HStack,
	Input,
	SimpleGrid,
	Textarea,
	VStack,
	useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { sendGiftCard } from "@/app/utils/serverActions";

import { useWallet } from "@/app/context/WalletContext";
import Confetti from "react-confetti";
import { templates } from "@/app/utils/templates";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { handleSendPayment } from "@/app/utils/contractActions";

type Template = {
	id: number;
	link: string;
};

type Inputs = {
	amount: number;
	note: string;
	receipent_email: string;
	currency: string;
	wallet: string;
	image: number;
	transaction_hash: string | null | undefined;
};

type GiftCardResponse = {
	status: number;
	message?: string;
	data?: unknown;
};

const CreateGiftCard = () => {
	const { walletAddress } = useWallet();
	const toast = useToast();
	const tokenBalance = 2000;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const [loading, setLoading] = useState(false);
	const [confetti, setConfitti] = useState(false);
	const [template, setTemplate] = useState<Template>({ link: "", id: 0 });
	const amountMin = 0.1;
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollTiles = (direction: string) => {
		if (scrollRef.current) {
			const scrollAmount = direction === "up" ? -150 : 150;
			scrollRef.current.scrollBy({
				top: scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const createGiftCard = async (data: Inputs) => {
		const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID as string;
		const tokenAddress = process.env.NEXT_PUBLIC_USDC_TOKEN_ID as string;
		const tokenAmount = Math.round(data.amount * 10 ** 7);

		try {
			setLoading(true);
			data.image = 16;
			data.currency = "usdc";
			data.wallet = walletAddress;

			const tx = await handleSendPayment(
				CONTRACT_ID,
				tokenAddress,
				walletAddress,
				tokenAmount
			);

			if (tx.status === "PENDING") {
				data.transaction_hash = tx.txhash;
				const giftCardResponse = (await sendGiftCard(data)) as GiftCardResponse;

				if (giftCardResponse?.status === 201) {
					setLoading(false);
					toast({
						title:
							"Gift card created successfully and sent to recipient's email",
						status: "success",
					});
					setConfitti(true);
					setTimeout(() => {
						setConfitti(false);
					}, 5000);
				} else {
					toast({
						title: "Failed to create gift card",
						status: "warning",
					});
				}
			} else {
				toast({
					title: "Failed to create gift card",
					status: "warning",
				});
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast({ title: error.message, status: "warning" });
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<VStack width={"full"}>
			{confetti && <Confetti />}
			<form onSubmit={handleSubmit(createGiftCard)} style={{ width: "100%" }}>
				<VStack gap={"18px"} width={"full"}>
					<FormControl width={"full"}>
						<FormLabel>Select your gift card design</FormLabel>

						<HStack alignItems={"center"} width={"full"} gap={6}>
							<Image
								src={templates[8].link}
								width={250}
								height={235}
								priority
								alt="selected giftcard design"
							/>

							<VStack height={"300px"} overflowY={"hidden"} gap={1}>
								<GoTriangleUp
									fontSize={"24px"}
									onClick={() => scrollTiles("up")}
									cursor={"pointer"}
								/>
								<VStack
									ref={scrollRef}
									gap={1}
									height={"240px"}
									overflowY={"scroll"}
								>
									<SimpleGrid columns={[1, 2, 3]} spacing={2}>
										{templates.length > 1 &&
											templates.map((image: Template) => {
												return (
													<Box
														key={image.id}
														_hover={{ border: "2px solid blue" }}
														border={
															image.link === template.link
																? "2px solid #fff"
																: "1px solid transparent"
														}
														cursor={"pointer"}
														onClick={() =>
															setTemplate({ link: image.link, id: image.id })
														}
													>
														<Image
															src={image.link}
															alt="giftcard design thumbnail"
															width={80}
															height={70}
															style={{ objectFit: "contain" }}
														/>
													</Box>
												);
											})}
									</SimpleGrid>
								</VStack>

								<GoTriangleDown
									fontSize={"24px"}
									onClick={() => scrollTiles("down")}
									cursor={"pointer"}
								/>
							</VStack>
						</HStack>
					</FormControl>
					<HStack width={"full"}>
						<FormControl flex={1}>
							<FormLabel fontSize={"small"}> Amount</FormLabel>

							<Input
								required
								type={"text"}
								padding={"12px"}
								size={"lg"}
								_focusVisible={{ outline: "none", border: "none" }}
								bg={"#dfe6f2"}
								color={"#373737"}
								border={"0px"}
								outline={"none"}
								placeholder="0"
								borderRadius={"12px"}
								{...register("amount", {
									min: {
										value: amountMin,
										message: `Minimum amount is ${amountMin}`,
									},
									max: { value: tokenBalance, message: "Insufficient funds" },
								})}
							/>

							<FormErrorMessage fontSize={"small"} color={"red"}>
								{errors.amount && errors.amount.message}
							</FormErrorMessage>
						</FormControl>
					</HStack>
					<HStack width={"full"}>
						<FormControl flex={2}>
							<FormLabel fontSize={"small"}>Recipient Email</FormLabel>

							<Input
								size={"lg"}
								_focusVisible={{ outline: "none", border: "none" }}
								bg={"#dfe6f2"}
								color={"#373737"}
								borderRadius={"12px"}
								padding={"10px"}
								border={"0px"}
								outline={"none"}
								placeholder="friend@mail.com"
								type="email"
								required
								{...register("receipent_email")}
							/>
						</FormControl>
					</HStack>
					<HStack
						width={"full"}
						flexDir={["column", "column", "row"]}
						alignItems={"flex-start"}
						gap={"20px"}
					>
						<FormControl>
							<FormLabel fontSize={"small"}>Note (optional)</FormLabel>
							<Textarea
								_focusVisible={{ outline: "none", border: "none" }}
								outline={"none"}
								bg={"#dfe6f2"}
								color={"#373737"}
								borderRadius={"12px"}
								padding={"10px"}
								placeholder="Your message here"
								{...register("note")}
							/>
						</FormControl>
					</HStack>
					<Box width={"full"}>
						<Button
							width={"full"}
							isLoading={loading}
							type="submit"
							isDisabled={!walletAddress}
							bg={"rgb(16, 61, 150)"}
							borderRadius={"full"}
							color={"#fff"}
							_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
							variant={"solid"}
						>
							Create & Send
						</Button>
					</Box>
				</VStack>
			</form>
		</VStack>
	);
};

export default CreateGiftCard;
