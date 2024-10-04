"use client";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
	Box,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerOverlay,
	HStack,
	Input,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import Image from "next/image";
import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { BsCircle } from "react-icons/bs";

type Props = {
	action: (e: any) => void;
	phoneNumber: string;
};

const PhoneNumberInput = ({ action, phoneNumber }: Props) => {
	const { selectedProvider } = useAirtimePurchase();
	const [supportedNetworks] = useState([
		{
			name: "MTN",
			logo: "/images/icons/mobileproviders/mtnLogo.png",
			id: "1",
			billerCode: "BIL099",
			itemCode: "AT099",
		},
		{
			name: "GLO",
			logo: "/images/icons/mobileproviders/gloLogo.png",
			id: "2",
			billerCode: "102",
			itemCode: "AT133",
		},
		{
			name: "Airtel",
			logo: "/images/icons/mobileproviders/airtelLogo.png",
			id: "3",
			billerCode: "BIL100",
			itemCode: "AT100",
		},
		{
			name: "9Mobile",
			logo: "/images/icons/mobileproviders/9mobileLogo.jpeg",
			id: "4",
			billerCode: "BIL103",
			item_code: "AT134",
		},
	]);
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<HStack
			width={"full"}
			bg={"#fff"}
			p={"5px 10px"}
			justifyContent={"space-between"}
			borderRadius={"12px"}
		>
			<HStack>
				<HStack
					cursor={"pointer"}
					onClick={() => {
						onOpen();
					}}
				>
					<Image
						alt={selectedProvider?.name || supportedNetworks[0]?.name}
						width={40}
						height={40}
						style={{ borderRadius: "50%" }}
						src={selectedProvider?.logo || `${supportedNetworks[0]?.logo}`}
					/>

					<TbTriangleInvertedFilled fontSize={"9px"} color="#cecdcd" />
				</HStack>
				<HStack>
					<Box width={"1px"} height={"20px"} bg={"grey"}></Box>
					<Input
						px={0}
						border={0}
						placeholder="09065738286"
						borderRadius={0}
						type="text"
						value={phoneNumber}
						fontSize={"lg"}
						fontWeight={"600"}
						outline={0}
						onChange={action}
						_focusVisible={{ border: 0 }}
					/>
				</HStack>
			</HStack>

			<PhoneNumberInputModal
				isOpen={isOpen}
				onClose={onClose}
				supportedNetworks={supportedNetworks}
			/>
		</HStack>
	);
};

const PhoneNumberInputModal = (props: any) => {
	const { selectedProvider, setSelectedProvider } = useAirtimePurchase();

	return (
		<Drawer isOpen={props.isOpen} placement="top" onClose={props.onClose}>
			<DrawerOverlay />
			<DrawerContent
				width={"600px"}
				maxW={"600px"}
				margin={"auto"}
				borderRadius={"0 0 12px 12px"}
			>
				<DrawerBody>
					<VStack
						bg={"#dfe6f2"}
						width={"full"}
						p={"10px"}
						borderRadius={"12px"}
						gap={"10px"}
					>
						{props.supportedNetworks.length > 0 &&
							props.supportedNetworks.map((network: any) => {
								return (
									<HStack
										width={"full"}
										justifyContent={"space-between"}
										borderBottom={"1px solid #cdcdcd"}
										pb={"10px"}
										key={network.id}
										onClick={() => {
											setSelectedProvider(network);
											props.onClose();
										}}
									>
										<HStack>
											<Image
												alt={network.name}
												width={40}
												height={40}
												style={{ borderRadius: "50%" }}
												src={network.logo}
											/>
											<Text fontSize={"xs"}>{network.name}</Text>
										</HStack>
										{selectedProvider?.id === network.id ? (
											<CheckCircleIcon color={"green"} />
										) : (
											<BsCircle color={"white"} />
										)}
									</HStack>
								);
							})}
					</VStack>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
};
export default PhoneNumberInput;
