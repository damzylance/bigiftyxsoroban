// src/utils/soroban.ts
import { Contract, Address, xdr } from "@stellar/stellar-sdk"; // Example, adjust to SDK usage
import { getAddress } from "@stellar/freighter-api";

// Initialize contract
export async function initializeContract(
	contractId: string,
	masterAddress: string
) {
	const contract = new Contract(contractId);
	return contract.call("initialize", xdr.ScVal.scvString(masterAddress));
}

// Deposit tokens
// export async function depositTokens(
// 	contractId: string,
// 	payee: string,
// 	tokenAddress: string,
// 	amount: number
// ) {
// 	const publicKey = await getPublicKey();
// 	const contract = new Contract(contractId);
// 	return await contract.methods.deposit(payee, tokenAddress, amount, {
// 		invoker: publicKey,
// 	});
// }

// // Get master address
// export async function getMasterAddress(contractId: string) {
// 	const contract = new Contract(contractId);
// 	return await contract.methods.master();
// }
