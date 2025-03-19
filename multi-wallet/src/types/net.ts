export interface NetworkInfo {
	chainId: number;
	chainName: string;
	rpcUrls: string[];
	iconUrls: string[];
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorerUrls: string[];
}

export enum PutNetType {
	MAIN = "mainnet",
	TEST = "testnet"
}

export enum SolNetType {
	MAIN = "mainnet",
	TEST = "testnet",
	DEV = "devnet"
}