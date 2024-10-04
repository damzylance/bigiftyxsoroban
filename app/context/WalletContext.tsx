"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface WalletContextType {
	walletAddress: string;
	usdcBalance: number;
	setWalletAddress: (address: string) => void;
	setUsdcBalance: (balance: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
	const [walletAddress, setWalletAddress] = useState("");
	const [usdcBalance, setUsdcBalance] = useState(0);

	return (
		<WalletContext.Provider
			value={{ walletAddress, usdcBalance, setWalletAddress, setUsdcBalance }}
		>
			{children}
		</WalletContext.Provider>
	);
};

export const useWallet = () => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error("useWallet must be used within a WalletProvider");
	}
	return context;
};
