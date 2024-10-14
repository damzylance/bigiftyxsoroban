import {
	isConnected,
	getAddress,
	requestAccess,
	isAllowed,
} from "@stellar/freighter-api";
import { useWallet } from "@/app/context/WalletContext";

export const useConnectWallet = () => {
	const { walletAddress, setWalletAddress } = useWallet();
	const connectWallet = async () => {
		try {
			if (await isConnected()) {
				if (await isAllowed()) {
					const publicKey = await getAddress();
					console.log(publicKey);
					setWalletAddress(publicKey.address);
					console.log("Connected with public key:", publicKey);
				} else {
					const isAppAllowed = await isAllowed();
					if (isAppAllowed.isAllowed) {
						const publicKey = await getAddress();
						console.log(publicKey);
						setWalletAddress(publicKey.address);
						console.log("Connected with public key:", publicKey);
					}
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
