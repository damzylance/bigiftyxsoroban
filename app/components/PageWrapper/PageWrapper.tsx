"use client";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { MdArrowBackIos } from "react-icons/md";
import WalletConnect from "../ConnectWallet/WalletConnect";
import Header from "../Header/Header";

interface PageWrapperProps {
	children: ReactNode;
	page: String;
}
const PageWrapper: React.FC<PageWrapperProps> = ({ children, page }) => {
	const router = useRouter();
	const pathName = usePathname();
	return (
		<VStack
			bg="gray.100"
			h="100vh"
			w="full"
			maxW={"650px"}
			margin={"auto"}
			position="relative"
		>
			<Header />

			<VStack
				mt="70px" // Adjusted to account for header height
				overflowY="auto"
				width={"full"}
				px={"20px"}
			>
				<HStack width={"full"} bg={"gray.100"} justifyContent={"space-between"}>
					<MdArrowBackIos cursor={"pointer"} onClick={() => router.back()} />
					<Text fontSize={"sm"} fontWeight={"600"}>
						{page}
					</Text>
					<Text fontSize={"sm"} fontWeight={"600"}>
						History
					</Text>
				</HStack>
				{
					<VStack
						p={0}
						bg="gray.100"
						mt="20px" // Adjusted to account for header height
						// Adjusted to account for footer height
						overflowY="auto"
						width={"full"}
					>
						<Box height={"800px"} width={"full"} maxW={"600px"} mx={"auto"}>
							{children}
						</Box>
					</VStack>
				}
			</VStack>
		</VStack>
	);
};

export default PageWrapper;
