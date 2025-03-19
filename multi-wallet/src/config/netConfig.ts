import type { NetworkInfo } from '@type/net';

export const EvmNetworks: NetworkInfo[] = [
	{
		chainId: 1,
		chainName: 'Ethereum',
		rpcUrls: ['https://rpc.flashbots.net'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorerUrls: ['https://etherscan.io']
	},
	{
		chainId: 56,
		chainName: 'BNB Smart Chain Mainnet',
		rpcUrls: ['https://bsc-pokt.nodies.app'],
		iconUrls: [],
		nativeCurrency: {
			name: 'BNB Chain Native Token',
			symbol: 'BNB',
			decimals: 18
		},
		blockExplorerUrls: ['https://bscscan.com']
	},
	{
		chainId: 97,
		chainName: 'BNB Smart Chain Testnet',
		rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
		iconUrls: [],
		nativeCurrency: {
			name: 'BNB Chain Native Token',
			symbol: 'tBNB',
			decimals: 18
		},
		blockExplorerUrls: ['https://testnet.bscscan.com/']
	},
	{
		chainId: 11155111,
		chainName: 'Sepolia',
		rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Sepolia Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorerUrls: ['https://sepolia.etherscan.io']
	},
	{
		chainId: 33772211,
		chainName: 'Xone Testnet',
		rpcUrls: ['https://rpc-testnet.xone.plus/'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Test XOne Coin',
			symbol: 'XOC',
			decimals: 18
		},
		blockExplorerUrls: ['https://testnet.xscscan.com']
	}
];

export const TronNetworks: NetworkInfo[] = [
	{
		chainId: 728126428,
		chainName: 'Tron-mainnet',
		rpcUrls: ['https://api.trongrid.io/jsonrpc'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Tron Token',
			symbol: 'TRX',
			decimals: 6
		},
		blockExplorerUrls: ['https://tronscan.org']
	},
	{
		chainId: 3448148188,
		chainName: 'Tron-nile',
		rpcUrls: ['https://nile.trongrid.io/jsonrpc'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Tron Token',
			symbol: 'TRX',
			decimals: 6
		},
		blockExplorerUrls: ['https://nile.tronscan.org']
	},
	{
		chainId: 2494104990,
		chainName: 'Tron-shasta',
		rpcUrls: ['https://api.shasta.trongrid.io/jsonrpc'],
		iconUrls: [],
		nativeCurrency: {
			name: 'Tron Token',
			symbol: 'TRX',
			decimals: 6
		},
		blockExplorerUrls: ['https://shasta.tronscan.org']
	}
];
