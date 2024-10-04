import React from "react";
import { HStack, Button, Avatar, Text } from "@chakra-ui/react";
import { useWallet } from "@/app/context/WalletContext"; // Import the custom hook
import { useConnectWallet } from "@/app/utils/hooks/useConnectWallet";
import TokenList from "../TokenList/TokenList";

const WalletConnect = () => {
	const { walletAddress } = useWallet();
	const { connectWallet } = useConnectWallet();

	return (
		<HStack>
			<TokenList />
			{!walletAddress ? (
				<Button
					bg={"rgb(16, 61, 150)"}
					borderRadius={"full"}
					color={"#fff"}
					_hover={{ color: "rgb(16, 61, 150)", background: "#dfe6f2" }}
					onClick={connectWallet}
					size={"sm"}
				>
					Sign in
				</Button>
			) : (
				<HStack gap={"5px"} cursor={"pointer"}>
					<Avatar size={"xs"} />
					<Text fontSize={"xs"} textTransform={"uppercase"}>
						{walletAddress.slice(0, 3)}
					</Text>
				</HStack>
			)}
		</HStack>
	);
};

export default WalletConnect;
