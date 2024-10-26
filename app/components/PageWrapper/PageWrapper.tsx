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
		<Box
			position="fixed"
			top={0}
			left={0}
			right={0}
			bottom={0}
			overflow="hidden"
			bg="gray.100"
		>
			<VStack
				h="100%"
				maxW="650px"
				margin="auto"
				position="relative"
				spacing={0}
			>
				{/* Fixed Header */}
				<Box
					position="absolute"
					top={0}
					left={0}
					right={0}
					zIndex={10}
					bg="white"
				>
					<Header />
				</Box>

				{/* Scrollable Content Area */}
				<VStack h="100%" w="100%" spacing={0} position="relative">
					{/* Navigation Bar - Fixed below header */}
					<Box
						position="absolute"
						top="60px" // Adjust based on your header height
						left={0}
						right={0}
						bg="gray.100"
						px={4}
						py={2}
						zIndex={5}
					>
						<HStack width="100%" justifyContent="space-between">
							<MdArrowBackIos cursor="pointer" onClick={() => router.back()} />
							<Text fontSize="sm" fontWeight="600">
								{page}
							</Text>
							<Text fontSize="sm" fontWeight="600">
								History
							</Text>
						</HStack>
					</Box>

					{/* Main Content */}
					<Box
						position="absolute"
						top="100px" // Adjust based on header + nav bar height
						left={0}
						right={0}
						bottom={0}
						overflowY="auto"
						px={4}
						pb={4}
						sx={{
							// Improve mobile scrolling
							WebkitOverflowScrolling: "touch",
							"&::-webkit-scrollbar": {
								display: "none",
							},
							scrollbarWidth: "none",
						}}
					>
						<Box width="100%" maxW="600px" mx="auto" minH="100%">
							{children}
						</Box>
					</Box>
				</VStack>
			</VStack>
		</Box>
	);
};

export default PageWrapper;
