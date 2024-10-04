"use client";
import React from "react";
import GiftCardTemplate from "..";
import Reedeem from "../../components/giftcard/Redeem";

type Props = {};

const Create = (props: Props) => {
	return (
		<>
			<GiftCardTemplate>
				<Reedeem />
			</GiftCardTemplate>
		</>
	);
};

export default Create;
