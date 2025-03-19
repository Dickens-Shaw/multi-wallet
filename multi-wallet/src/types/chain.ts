export enum ChainType {
	EVM = "Ethereum",
	PUT = "PUT",
	SOL = "Solana",
	Tron = "Tron",
	TON = "TON",
	TON_TEST = "TONTESTNET",
	APTOS = "Aptos",
	BTC = "Bitcoin",
	ENDLESS = "Endless"
}

type ChainBlockExplorer = {
	name: string;
	url: string;
	apiUrl?: string | undefined;
};
type ChainNativeCurrency = {
	name: string;
	symbol: string;
	decimals: number;
};

type ChainRpcUrls = {
	http: readonly string[];
	webSocket?: readonly string[] | undefined;
};

export type Chain = {
	blockExplorers?:
		| {
				[key: string]: ChainBlockExplorer;
				default: ChainBlockExplorer;
		  }
		| undefined;

	id: number;
	name: string;
	nativeCurrency: ChainNativeCurrency;
	rpcUrls: {
		[key: string]: ChainRpcUrls;
		default: ChainRpcUrls;
	};
	sourceId?: number | undefined;
	testnet?: boolean | undefined;
};

export type AddEthereumChainParameter = {
	chainId: string;
	chainName: string;
	rpcUrls: string[];
	iconUrls?: string[];
	nativeCurrency?: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorerUrls?: string[];
};

export type SwitchChainParameter = {
	addEthereumChainParameter?: AddEthereumChainParameter;
	chainId: number;
};
// export type ConnectParameter = {
// 	chainType?: string;
// 	name?: string;
// 	chainId?: number;
// 	isReconnecting?: boolean;
// };
