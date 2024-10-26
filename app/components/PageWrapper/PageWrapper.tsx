"use client";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";
import { MdArrowBackIos } from "react-icons/md";
import Header from "../Header/Header";

interface PageWrapperProps {
	children: ReactNode;
	page: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, page }) => {
	const router = useRouter();

	return (
		<VStack
			bg="gray.100"
			h="100vh"
			w="full"
			maxW="650px"
			margin="auto"
			position="relative"
			spacing={0} // Remove default spacing between VStack items
		>
			{/* Fixed Header */}
			<Box position="fixed" top={0} width="full" maxW="650px" zIndex={10}>
				<Header />
			</Box>

			{/* Main Content Container */}
			<VStack
				width="full"
				h="100vh"
				pt="70px" // Space for fixed header
				spacing={0}
			>
				{/* Navigation Bar */}
				<HStack
					width="full"
					bg="gray.100"
					justifyContent="space-between"
					px="20px"
					py={2}
				>
					<MdArrowBackIos cursor="pointer" onClick={() => router.back()} />
					<Text fontSize="sm" fontWeight="600">
						{page}
					</Text>
					<Text fontSize="sm" fontWeight="600">
						History
					</Text>
				</HStack>

				{/* Scrollable Content Area */}
				<Box width="full" flex={1} overflowY="auto" px="20px" py={4}>
					<Box width="full" maxW="600px" mx="auto">
						{children}
					</Box>
				</Box>
			</VStack>
		</VStack>
	);
};

export default PageWrapper;
