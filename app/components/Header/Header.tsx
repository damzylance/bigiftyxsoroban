import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex, HStack, IconButton, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import WalletConnect from "../ConnectWallet/WalletConnect";
import { useRouter } from "next/navigation";

const Header = () => {
	const router = useRouter();
	return (
		<Flex
			as="header"
			bg="gray.100"
			p={4}
			maxW={"650px"}
			align="center"
			position="absolute"
			top={0}
			left={0}
			right={0}
			zIndex={10}
		>
			<HStack alignItems={"center"}>
				<Image
					src={"/images/images/bitgiftyLogo.png"}
					alt="BitGifty"
					width={16}
					height={32}
					onClick={() => {
						router.push("/");
					}}
					style={{ cursor: "pointer" }}
				/>
				<IconButton
					icon={<HamburgerIcon fontSize={"32px"} />}
					aria-label="Menu"
					variant="ghost"
					color="#616161"
				/>
			</HStack>

			<Spacer />
			<WalletConnect />
		</Flex>
	);
};

export default Header;
