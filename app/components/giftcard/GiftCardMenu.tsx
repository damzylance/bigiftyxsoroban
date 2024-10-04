import { HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
	icon?: ReactNode;
	to: string;
	name: string;
};

const GiftCardMenu: React.FC<Props> = ({ icon, to, name }) => {
	const currentPath = usePathname();
	const isActive = (path: string) => {
		return path.split("/")[1] === to.split("/")[1];
	};

	return (
		<Link
			href={to}
			style={
				isActive(currentPath)
					? {
							background: "#333",
							width: "90%",
							margin: "auto",
							padding: "18px",
							borderRadius: "6px",
					  }
					: { width: "90%", margin: "auto", padding: "18px" }
			}
		>
			<HStack
				color={"#fff"}
				width={"60%"}
				justifyContent={"flex-start"}
				margin={"auto"}
				gap={"10px"}
				cursor={"pointer"}
			>
				{icon}
				<Text fontWeight={"500"}>{name}</Text>
			</HStack>
		</Link>
	);
};

export default GiftCardMenu;
