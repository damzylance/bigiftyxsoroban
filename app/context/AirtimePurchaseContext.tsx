import React, { createContext, useContext, useState } from "react";

// Define the type for selectedProvider
type ProviderType = {
	name: string;
	logo: string;
	id: string;
	billerCode: string;
	itemCode: string;
};

// Define the context type
type AirtimePurchaseContextType = {
	selectedProvider: ProviderType | null;
	setSelectedProvider: (provider: ProviderType) => void;
	fiatAmount: number;
	setFiatAmount: (amount: number) => void;
	tokenAmount: number;
	setTokenAmount: (amount: number) => void;
	phoneNumber: string;
	setPhoneNumber: (number: string) => void;
	country: string;
	setCountry: (country: string) => void;
};

// Create the context
const AirtimePurchaseContext = createContext<
	AirtimePurchaseContextType | undefined
>(undefined);

// Create a provider component
export const AirtimePurchaseProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [selectedProvider, setSelectedProvider] = useState<ProviderType | null>(
		null
	);
	const [fiatAmount, setFiatAmount] = useState<number>(0);
	const [tokenAmount, setTokenAmount] = useState<number>(0);
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [country, setCountry] = useState<string>("");

	const value = {
		selectedProvider,
		setSelectedProvider,
		fiatAmount,
		setFiatAmount,
		tokenAmount,
		setTokenAmount,
		phoneNumber,
		setPhoneNumber,
		country,
		setCountry,
	};

	return (
		<AirtimePurchaseContext.Provider value={value}>
			{children}
		</AirtimePurchaseContext.Provider>
	);
};

// Custom hook to use the context
export const useAirtimePurchase = () => {
	const context = useContext(AirtimePurchaseContext);
	if (!context) {
		throw new Error(
			"useAirtimePurchase must be used within an AirtimePurchaseProvider"
		);
	}
	return context;
};
