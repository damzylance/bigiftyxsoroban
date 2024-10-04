"use client";
import React from "react";
import CreateGiftCard from "../../components/giftcard/CreateGiftCard";
import GiftCardTemplate from "..";

type Props = {};

const Create = (props: Props) => {
	return (
		<>
			<GiftCardTemplate>
				<CreateGiftCard />
			</GiftCardTemplate>
		</>
	);
};

export default Create;
