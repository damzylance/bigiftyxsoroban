"use client";
import React from "react";
import MyCards from "../../components/giftcard/MyCards";
import GiftCardTemplate from "..";

const Cards = () => {
	return (
		<>
			<GiftCardTemplate>
				<MyCards />
			</GiftCardTemplate>
		</>
	);
};

export default Cards;
