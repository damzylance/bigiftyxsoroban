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
import React, { useEffect } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";
import Image from "next/image";
import { useAirtimePurchase } from "@/app/context/AirtimePurchaseContext";
import { BsCircle } from "react-icons/bs";
import { validatePhoneNumber } from "@/app/utils/utils";

type ProviderType = {
	id: string;
	name: string;
	logo: string;
	billerCode: string;
	itemCode: string;
};

type Props = {
	action: (e: React.ChangeEvent<HTMLInputElement>) => void;
	phoneNumber: string;
	supportedNetworks: ProviderType[];
};
type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	supportedNetworks: ProviderType[];
};

const PhoneNumberInput = ({
	action,
	phoneNumber,
	supportedNetworks,
}: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { selectedProvider, setSelectedProvider } = useAirtimePurchase();
	useEffect(() => {
		if (!selectedProvider && supportedNetworks.length > 0) {
			setSelectedProvider(supportedNetworks[0]);
		}
	}, []);
	return (
		<HStack
			width={"full"}
			bg={"#fff"}
			border={!validatePhoneNumber(phoneNumber) ? "0.5px #E0666A solid" : ""}
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
						size={"lg"}
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

export const PhoneNumberInputModal = ({
	isOpen,
	onClose,
	supportedNetworks,
}: ModalProps) => {
	const { selectedProvider, setSelectedProvider } = useAirtimePurchase();

	return (
		<Drawer isOpen={isOpen} placement="top" onClose={onClose}>
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
						{supportedNetworks.length > 0 &&
							supportedNetworks.map((network) => {
								return (
									<HStack
										cursor={"pointer"}
										width={"full"}
										justifyContent={"space-between"}
										borderBottom={"1px solid #cdcdcd"}
										pb={"10px"}
										key={network.id}
										onClick={() => {
											setSelectedProvider(network);
											console.log(network);
											onClose();
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
