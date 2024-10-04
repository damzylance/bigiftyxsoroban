import { HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = { icon: any; name: string; url: string };

const GiftCardServiceItem = ({ icon, name, url }: Props) => {
	const router = useRouter();
	return (
		<VStack
			gap={"10px"}
			cursor={"pointer"}
			onClick={() => router.push(`/giftcard/${url}`)}
		>
			<HStack
				padding={"12px"}
				borderRadius={"12px"}
				bg={"#dfe6f2"}
				color={"rgb(16, 61, 150)"}
			>
				<Icon as={icon} fontSize={"24px"} />
			</HStack>
			<Text fontSize={"xs"}>{name}</Text>
		</VStack>
	);
};

export default GiftCardServiceItem;
