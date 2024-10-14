import { signTransaction } from "@stellar/freighter-api";
import {
	Address,
	BASE_FEE,
	Contract,
	Networks,
	SorobanRpc,
	Transaction,
	TransactionBuilder,
	xdr,
} from "@stellar/stellar-sdk";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const SOROBAN_URL = "https://soroban-testnet.stellar.org:443";

export const handleSendPayment = async (
	CONTRACT_ID: string,
	tokenAddress: string,
	walletAddress: string,
	tokenAmount: number
) => {
	const amount = xdr.ScVal.scvI128(
		new xdr.Int128Parts({
			lo: xdr.Uint64.fromString(tokenAmount.toString()), // Replace AMOUNT with your deposit amount
			hi: xdr.Int64.fromString("0"), // Assumes amount fits into lower 64 bits
		})
	);

	try {
		// Initialize server and contract
		const server = new SorobanRpc.Server(SOROBAN_URL);
		const account = await server.getAccount(walletAddress);
		const contract = new Contract(CONTRACT_ID);

		console.log("Contract found", NETWORK_PASSPHRASE);

		// Build the transaction to send token
		const tx = new TransactionBuilder(account, {
			fee: BASE_FEE,
			networkPassphrase: NETWORK_PASSPHRASE,
		})
			.addOperation(
				contract.call(
					"make_payment",
					new Address(walletAddress).toScVal(),
					new Address(tokenAddress).toScVal(),
					amount
				)
			)
			.setTimeout(240)
			.build();

		// Prepare the transaction
		const preparedTransaction = await server.prepareTransaction(tx);
		console.log("got to preparedTransaction ", preparedTransaction);

		// Sign the prepared transaction
		const signedXdr = await signTransaction(preparedTransaction.toXDR(), {
			networkPassphrase: Networks.TESTNET,
		});

		console.log("got to signedXdr ", signedXdr);

		const signedTx = TransactionBuilder.fromXDR(
			signedXdr.signedTxXdr,
			Networks.TESTNET
		);
		console.log("got to signedTx ", signedTx);

		// Submit the transaction

		const submittedTx = await server.sendTransaction(signedTx);
		console.log("got to submittedTx ", submittedTx);

		if (submittedTx.status !== "PENDING") {
			throw new Error("Transaction failed to submit");
		}

		// Poll for transaction confirmation
		return {
			status: submittedTx.status,
			txhash: submittedTx.hash,
			message: "Trasaction sent",
		};
	} catch (error: unknown) {
		console.error("Error submitting transaction:", error);
		if (error instanceof Error) {
			if (error.message) {
				console.error("Error message:", error.message);
			}
		} else if (
			typeof error === "object" &&
			error !== null &&
			"response" in error
		) {
			const axiosError = error as { response?: { data?: unknown } }; // Narrow the type
			if (axiosError.response && axiosError.response.data) {
				console.error("Detailed error:", axiosError.response.data);
			}
		}
		return { status: "error", txhash: null, message: "Transaction failed" };
	}
};

// const pollTransactionConfirmation = async (
// 	server: SorobanRpc.Server,
// 	hash: string
// ) => {
// 	let response = await server.getTransaction(hash);

// 	while (response.status === "NOT_FOUND") {
// 		console.log("Waiting for transaction confirmation...");
// 		await new Promise((resolve) => setTimeout(resolve, 1000));
// 		response = await server.getTransaction(hash);
// 	}

// 	if (response.status === "SUCCESS" && response.resultMetaXdr) {
// 		return response;
// 	} else {
// 		throw new Error(
// 			`Transaction failed: ${response.resultXdr || "Unknown error"}`
// 		);
// 	}
// };

// const approveToken = async (
// 	CONTRACT_ID: string,
// 	tokenAddress: string,
// 	walletAddress: string
// ) => {
// 	//
// 	try {
// 		// Initialize server and contract
// 		const server = new SorobanRpc.Server(SOROBAN_URL);
// 		const account = await server.getAccount(walletAddress);
// 		const { sequence } = await server.getLatestLedger();
// 		console.log(sequence);
// 		const expirationLedger = sequence + 1000000;
// 		console.log(expirationLedger);
// 		const tokenSmartContract = new Contract(
// 			"CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
// 		);

// 		console.log("Contract found", NETWORK_PASSPHRASE);
// 		const amount = xdr.ScVal.scvI128(
// 			new xdr.Int128Parts({
// 				lo: xdr.Uint64.fromString(BigInt(1000000000).toString()), // Replace AMOUNT with your deposit amount
// 				hi: xdr.Int64.fromString("0"), // Assumes amount fits into lower 64 bits
// 			})
// 		);
// 		const tx = new TransactionBuilder(account, {
// 			fee: BASE_FEE,
// 			networkPassphrase: NETWORK_PASSPHRASE,
// 		})
// 			.addOperation(
// 				tokenSmartContract.call(
// 					"approve",
// 					new Address(walletAddress).toScVal(),
// 					new Address(CONTRACT_ID).toScVal(),
// 					amount,
// 					xdr.ScVal.scvU32(expirationLedger)
// 				)
// 			)
// 			.setTimeout(240)
// 			.build();
// 		const preparedTransaction = await server.prepareTransaction(tx);
// 		const xdrTransaction = preparedTransaction.toXDR();
// 		// Sign the transaction using Freighter
// 		const signedXdr = await signTransaction(xdrTransaction, {
// 			networkPassphrase: Networks.TESTNET,
// 		});
// 		// Send the signed transaction
// 		const response = await server.sendTransaction(
// 			new Transaction(signedXdr.signedTxXdr, Networks.TESTNET)
// 		);

// 		console.log(response);
// 		if (response.status !== "PENDING") {
// 			throw new Error("Transaction failed to submit");
// 		}

// 		// Poll for transaction confirmation
// 		await pollTransactionConfirmation(server, response.hash);
// 	} catch (error: any) {
// 		console.error("Error submitting transaction:", error);
// 		if (error.response && error.response.data) {
// 			console.error("Detailed error:", error.response.data);
// 		}
// 	}
// };

// const getAllowance = async (
// 	CONTRACT_ID: string,
// 	tokenAddress: string,
// 	walletAddress: string
// ) => {
// 	try {
// 		// Initialize server and contract
// 		const server = new SorobanRpc.Server(SOROBAN_URL);
// 		const tokenContract = new Contract(tokenAddress);

// 		// Convert addresses to Soroban `Address` format
// 		const from = new Address(walletAddress).toScVal();
// 		const spender = new Address(CONTRACT_ID).toScVal();
// 		const account = await server.getAccount(walletAddress);

// 		const tx = new TransactionBuilder(account, {
// 			fee: BASE_FEE,
// 			networkPassphrase: NETWORK_PASSPHRASE,
// 		})
// 			.addOperation(tokenContract.call("allowance", from, spender))
// 			.setTimeout(30)
// 			.build();

// 		// Simulate the transaction instead of sending it
// 		const simulateResponse = await server.simulateTransaction(tx);
// 		console.log(simulateResponse);

// 		if (simulateResponse) {
// 			const result = simulateResponse.result;
// 			console.log(result);
// 			if (result.auth && result.retval) {
// 				console.log("Allowance:", result.retval._switch.value);
// 			} else {
// 				console.log("Unexpected result:", result);
// 			}
// 		} else {
// 			console.log("No results from simulation");
// 		}
// 	} catch (error) {
// 		console.error("Error fetching allowance:", error);
// 	}
// };
