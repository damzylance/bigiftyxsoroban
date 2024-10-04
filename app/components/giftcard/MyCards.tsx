import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	Box,
	Container,
	HStack,
	SimpleGrid,
	Spinner,
	Text,
	Modal,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalOverlay,
	useToast,
	VStack,
	useDisclosure,
	Button,
} from "@chakra-ui/react";
import Image from "next/image";

import { FaCopy } from "react-icons/fa";
import { useWallet } from "@/app/context/WalletContext";
import { templates } from "@/app/utils/templates";
function MyCards() {
	const toast = useToast();
	const [cards, setCards] = useState([]);

	const [loading, setLoading] = useState(true);
	const { walletAddress } = useWallet();

	const fetchCards = async () => {
		await axios
			.get(
				`${process.env.NEXT_PUBLIC_BASE_URL}/giftcard/create?address=${walletAddress}`
			)
			.then((response) => {
				setLoading(false);
				setCards(response.data.results);
			})
			.catch((error) => {
				setLoading(false);
				toast({ title: "Error fetching cards", status: "warning" });
			});
	};

	useEffect(() => {
		fetchCards();
	}, []);

	return (
		<Box mt={"30px"} cursor={"pointer"}>
			<SimpleGrid columns={[2, 2, 4]} spacing="4">
				{" "}
				{loading ? (
					<Container>
						<Spinner />
					</Container>
				) : cards.length > 0 ? (
					cards.toReversed().map((card: any, id) => {
						let link;
						for (let x = 0; x < templates.length; x++) {
							if (card.image === templates[x].id) {
								link = templates[x].link;
							} else if (card.image < templates[x].id) {
								link = templates[8].link;
							}
						}
						return (
							<Card
								key={id}
								amount={card.amount}
								image={templates.length > 0 ? link : ""}
								currency={card.currency}
								code={card.code}
								status={card.status}
								receipent={card.receipent_email}
								createdOn={card.creation_date}
							/>
						);
					})
				) : (
					<Text>No Giftcard created</Text>
				)}
			</SimpleGrid>
		</Box>
	);
}
const Card = (props: any) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<VStack
			width={"full"}
			boxShadow={
				"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;"
			}
			borderRadius={"10px"}
			gap={"5"}
			padding={"10px"}
			onClick={onOpen}
		>
			<Image src={props.image} width={250} height={150} alt="" />
			<VStack width={"full"}>
				<Text>Amount</Text>
				<Text textTransform={"uppercase"} fontWeight={"bold"} fontSize={"sm"}>
					{props.amount === 10000000 ? "1" : props.amount} {props.currency}
				</Text>
			</VStack>

			<CardModal
				onClose={onClose}
				isOpen={isOpen}
				image={props.image}
				amount={props.amount}
				currency={props.currency}
				code={props.code}
				status={props.status}
				createdOn={new Date(props.createdOn).toLocaleDateString()}
				receipent={props.receipent}
			/>
		</VStack>
	);
};
const CardModal = (props: any) => {
	const [showCode, setShowCode] = useState(false);
	const toast = useToast();

	return (
		<Modal
			isCentered
			onClose={props.onClose}
			isOpen={props.isOpen}
			motionPreset="slideInBottom"
			size={"lg"}
		>
			<ModalOverlay
				bg="blackAlpha.100"
				backdropFilter="blur(20px) hue-rotate(10deg)"
			/>
			<ModalContent border={"1px solid #cdcdd8"}>
				<ModalCloseButton />

				<Box
					width={"0px"}
					height={"10px"}
					borderLeft={"70px solid transparent"}
					borderRight={"70px solid transparent"}
					borderBottom={`70px solid ${
						props.status === "generated" ? "green" : "red"
					}`}
					transform={"rotate(-45deg)"}
					position={"relative"}
					left={"-45px"}
					top={"-15px"}
				></Box>
				<Text
					position={"absolute"}
					left={"0%"}
					fontWeight={"500"}
					top={"4.5%"}
					transform={"rotate(-45deg)"}
					color={"#fff"}
				>
					{props.status === "generated" ? "Active" : "Redeemed"}
				</Text>
				<ModalHeader textAlign={"center"}>View Gift Card</ModalHeader>
				<ModalBody>
					<VStack width={"full"} alignItems={"center"}>
						{" "}
						<Image
							style={{ textAlign: "center" }}
							alt=""
							width={300}
							height={200}
							src={props.image}
						/>
					</VStack>

					<HStack width={"full"} justifyContent={"center"} gap={"10px"}>
						<Text>Amount:</Text>
						<HStack>
							<Text fontSize={"4xl"}>
								{props.amount === "10000000" ? "10" : props.amount}
							</Text>
							<Text>{props.currency}</Text>
						</HStack>
					</HStack>
					<HStack width={"full"} justifyContent={"center"}>
						<Text>Created on:</Text>
						<Text fontSize={["md", "md", "lg"]}>{props.createdOn}</Text>
					</HStack>
					{props.receipent && (
						<HStack width={"full"} justifyContent={"center"}>
							<Text>Recipent:</Text>
							<Text fontSize={["md", "md", "md"]}>{props.receipent}</Text>
						</HStack>
					)}
					<Box width={"full"}>
						{showCode === true && (
							<Text textAlign={"center"} my={2} fontSize={"lg"}>
								{props.code}
							</Text>
						)}
						{showCode === false && (
							<Text textAlign={"center"} fontSize={"4xl"}>
								############
							</Text>
						)}
					</Box>
					<HStack justifyContent={"center"} gap={"20px"}>
						<Button
							onClick={() => setShowCode(!showCode)}
							bg={"rgb(16, 61, 150)"}
							borderRadius={"full"}
							color={"#fff"}
							_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
							variant={"solid"}
						>
							{showCode ? "Hide code" : "Reveal Code"}
						</Button>
						{showCode && (
							<FaCopy
								fontSize={"2xl"}
								cursor={"pointer"}
								onClick={() => {
									navigator.clipboard.writeText(props.code);
									toast({ title: "Code copied", status: "success" });
								}}
							/>
						)}
					</HStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
export default MyCards;
