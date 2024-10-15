import {
	isConnected,
	getAddress,
	requestAccess,
	isAllowed,
	setAllowed,
} from "@stellar/freighter-api";
import { useWallet } from "@/app/context/WalletContext";

export const useConnectWallet = () => {
	const { walletAddress, setWalletAddress } = useWallet();

	const handleWalletConnection = async () => {
		try {
			const publicKey = await getAddress();
			setWalletAddress(publicKey.address);
			console.log("Connected with public key:", publicKey);
		} catch (error) {
			console.error("Error retrieving wallet address:", error);
		}
	};

	const connectWallet = async () => {
		try {
			if (await isConnected()) {
				const { isAllowed: allowed } = await isAllowed();

				if (allowed) {
					await handleWalletConnection();
				} else {
					await setAllowed();
					await handleWalletConnection();
				}
			} else {
				const accessObj = await requestAccess();
				if (accessObj.error) {
					return accessObj.error;
				} else {
					return accessObj.address;
				}
			}
		} catch (error) {
			console.error("Error connecting wallet:", error);
		}
	};

	return {
		walletAddress,
		connectWallet,
	};
};
