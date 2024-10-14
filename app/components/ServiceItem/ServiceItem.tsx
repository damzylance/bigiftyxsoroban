import { HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

type Props = { icon: IconType; name: string };

const ServiceItem = ({ icon, name }: Props) => {
	const router = useRouter();
	return (
		<VStack
			gap={"10px"}
			cursor={"pointer"}
			onClick={() =>
				router.push(`${name === "Data" ? "mobile-data" : name.toLowerCase()}`)
			}
		>
			<HStack
				padding={"12px"}
				borderRadius={"50%"}
				bg={"#dfe6f2"}
				color={"rgb(16, 61, 150)"}
			>
				<Icon as={icon} fontSize={"24px"} />
			</HStack>
			<Text fontSize={"xs"}>{name}</Text>
		</VStack>
	);
};

export default ServiceItem;
