import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
	Avatar,
	HStack,
	Text,
	useDisclosure,
	VStack,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Img,
} from "@chakra-ui/react";
import React, { useState } from "react";
import usdcLogo from "../../assets/icons/tokenicons/usdcLogo.svg";
import Image from "next/image";

type Props = {};

const TokenList = (props: Props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<VStack
			borderRadius={"20px"}
			bg={"#fff"}
			p={"5px"}
			onClick={onOpen}
			cursor={"pointer"}
		>
			<HStack>
				<HStack>
					<Image
						width={20}
						height={20}
						src={"/images/icons/tokenicons/usdcLogo.svg"}
						alt="usdc"
					/>
					<Text fontSize={"xs"} fontWeight={"20px"}>
						USDC
					</Text>
				</HStack>
				<ArrowForwardIcon />
			</HStack>
			<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent borderRadius={"20px 20px 0px 0px"}>
					<DrawerBody py={"20px"}>
						<VStack alignItems={"flex-start"} gap={"20px"} width={"full"}>
							<TokenWrapper />
							<TokenWrapper />
							<TokenWrapper />
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</VStack>
	);
};

const TokenWrapper = () => {
	return (
		<HStack gap={"10px"} justifyContent={"flex-start"}>
			<Avatar size={"md"} />
			<VStack gap={"1px"} spacing={0} alignItems={"flex-start"}>
				<Text size={"sm"} fontWeight={"500"}>
					USDC
				</Text>
				<Text size={"sm"} textColor={"GrayText"}>
					0xa0b8...eb48
				</Text>
			</VStack>
		</HStack>
	);
};

export default TokenList;
