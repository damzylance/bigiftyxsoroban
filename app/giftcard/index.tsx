"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { Box, Button, Divider, Flex, VStack } from "@chakra-ui/react";

import { RxCardStack, RxPlus } from "react-icons/rx";
import { MdRedeem } from "react-icons/md";
import Link from "next/link";
import PageWrapper from "../components/PageWrapper/PageWrapper";
interface Props {
	children: ReactNode;
}
const GiftCardTemplate: FC<Props> = ({ children }) => {
	const [page, setPage] = useState("");

	useEffect(() => {
		// Check if window is defined before using it
		if (typeof window !== "undefined") {
			const currentPage = window.location.pathname.split("/")[2];
			console.log("Current Pathname:", currentPage);
			setPage(currentPage);
		}
	}, []);

	return (
		<PageWrapper page={"Giftcard"}>
			<VStack bg={"#fff"} borderRadius={"12px"} p={"20px 10px"} mb={"20px"}>
				<Flex height={"50px"} gap={5}>
					<Link href={"/giftcard/create"}>
						<Button
							borderRadius={"none"}
							rightIcon={<RxPlus />}
							variant={page === "create" ? "solid" : "outline"}
							size={["xs", "sm", "md"]}
							color={page === "create" ? "#fff" : "#3f6ac7"}
							bg={
								page === "create"
									? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
									: ""
							}
						>
							Create
						</Button>
					</Link>
					<Link href={"/giftcard/redeem"}>
						<Button
							size={["xs", "sm", "md"]}
							rightIcon={<MdRedeem />}
							variant={page === "redeem" ? "solid" : "outline"}
							color={page === "redeem" ? "#fff" : "#3f6ac7"}
							bg={
								page === "redeem"
									? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
									: ""
							}
							borderRadius={"none"}
						>
							Reedeem
						</Button>
					</Link>
					<Link href={"/giftcard/my-cards"}>
						<Button
							size={["xs", "sm", "md"]}
							rightIcon={<RxCardStack />}
							borderRadius={"none"}
							variant={page === "cards" ? "solid" : "outline"}
							color={page === "my-cards" ? "#fff" : "#3f6ac7"}
							bg={
								page === "my-cards"
									? " linear-gradient(106deg, #103D96 27.69%, #306FE9 102.01%)"
									: ""
							}
						>
							My Cards
						</Button>
					</Link>
				</Flex>
				<Box width={"full"}>{children}</Box>
			</VStack>
		</PageWrapper>
	);
};

export default GiftCardTemplate;
