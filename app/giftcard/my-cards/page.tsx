"use client";
import React from "react";
import MyCards from "../../components/giftcard/MyCards";
import GiftCardTemplate from "..";

type Props = {};

const Cards = (props: Props) => {
	return (
		<>
			<GiftCardTemplate>
				<MyCards />
			</GiftCardTemplate>
		</>
	);
};

export default Cards;
