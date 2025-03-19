import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Connector, IContractOptions } from '@type/connector';
import { ConnectStatus } from '@type/connector';
import { ChainType } from '@web3jskit/type';
import type { SupportWallet } from '@config/walletConfig';
import { createConnectorProxy } from '@utils/proxy';
import { EvmNetworks, TronNetworks } from '@config/netConfig';
import type { NetworkInfo } from '@type/net';

type MulticallOption = {
	multicallAddress: string;
	multicallAbi: any;
	rpcUrl?: string;
};

export interface WalletHelperState {
	isConnecting:
		| {
				icon: string;
				name: string;
		  }
		| boolean;

	supportWallets: SupportWallet[];
	setSupportWallets: (wallets: SupportWallet[]) => void;

	customEvmNetworks: NetworkInfo[];
	setCustomEvmNetworks: (networks: NetworkInfo[]) => void;
	getSupportNets: () => NetworkInfo[];

	connectors: Connector[];
	getConnectors: () => any[];

	currentConnector: Connector | null;
	currentConnectorName: string;
	getCurrentConnector: () => Connector | null;
	setCurrentConnector: (connector: Connector) => void;

	provider: any;
	getProvider: () => Promise<any>;
	setProvider: (provider: any) => void;

	currentChainType: ChainType;
	getCurrentChainType: () => ChainType;
	setChainType: (chainType: ChainType) => void;

	currentNetworkId: number;
	currentNetwork: NetworkInfo | null;
	getCurrentNetwork: () => NetworkInfo | null;
	setCurrentNetwork: (networkId: number) => void;

	connectStatus: ConnectStatus;
	getConnectStatus: () => ConnectStatus;
	setConnectStatus: (status: ConnectStatus) => void;

	walletAddress: string;
	getWalletAddress: () => string;
	setWalletAddress: (address: string) => void;

	resetStatus: () => void;

	getConnectorProxy: () => any;
	disconnect: () => Promise<void>;
	signMessage: (message: string) => Promise<any>;
	signTransaction: (transaction: any) => Promise<any>;
	sendTransaction: (transaction: any) => Promise<any>;
	waitForTransactionReceipt: (hash: string, timeout?: number) => Promise<any>;
	readContract: (params: IContractOptions) => Promise<any>;
	writeContract: (params: IContractOptions) => Promise<any>;
	multipleRequest: (requests: { method: string; params?: any[] }[]) => Promise<any[]>;
	multicall: (requests: IContractOptions[], option: MulticallOption) => Promise<any[]>;
	switchNetwork: (chainId: number | string) => Promise<any>;
}

export const walletHelperStore = create<WalletHelperState>()(
	persist(
		(set, get) => ({
			supportWallets: [],
			setSupportWallets: (wallets: SupportWallet[]) => {
				set({ supportWallets: wallets });
			},

			customEvmNetworks: [],
			setCustomEvmNetworks: (networks: NetworkInfo[]) => {
				set({ customEvmNetworks: networks });
			},
			getSupportNets: () => {
				const { currentChainType, customEvmNetworks } = get();
				if (currentChainType === ChainType.EVM) {
					return [...EvmNetworks, ...customEvmNetworks];
				} else if (currentChainType === ChainType.Tron) {
					return TronNetworks;
				} else {
					return [];
				}
			},

			connectors: [],
			getConnectors: () => {
				return get().connectors;
			},
			setConnectors: (connectors: Connector[]) => {
				set({ connectors: connectors });
			},

			currentConnector: null,
			currentConnectorName: '',
			getCurrentConnector: () => {
				return get().currentConnector;
			},
			setCurrentConnector: (connector: Connector) => {
				set({ currentConnector: connector, currentConnectorName: connector.name });
			},

			provider: null,
			getProvider: () => {
				return get().provider;
			},
			setProvider: (provider: any) => {
				set({ provider });
			},

			currentChainType: ChainType.EVM,
			getCurrentChainType: () => {
				return get().currentChainType;
			},
			setChainType: (chainType: ChainType) => {
				set({ currentChainType: chainType });
			},

			currentNetworkId: 1,
			currentNetwork: null,
			getCurrentNetwork: () => {
				return get().currentNetwork;
			},
			setCurrentNetwork: (networkId: number) => {
				const network = get()
					.getSupportNets()
					.find(net => net.chainId === networkId);
				if (network) {
					set({ currentNetwork: network });
					set({ currentNetworkId: networkId });
				}
				return network;
			},

			isConnecting: false,

			connectStatus: ConnectStatus.Disconnected,
			getConnectStatus: () => {
				return get().connectStatus;
			},
			setConnectStatus: (status: ConnectStatus) => {
				set({ connectStatus: status });
			},

			walletAddress: '',
			getWalletAddress: () => {
				return get().walletAddress;
			},
			setWalletAddress: (address: string) => {
				set({ walletAddress: address });
			},

			resetStatus: () => {
				set({
					connectStatus: ConnectStatus.Disconnected,
					currentConnector: null,
					walletAddress: '',
					provider: null,
					isConnecting: false
				});
			},

			getConnectorProxy: () => {
				return createConnectorProxy(get().currentConnector);
			},
			disconnect: async () => get().getConnectorProxy().disconnect(),
			signMessage: async (message: string) => get().getConnectorProxy().signMessage(message),
			signTransaction: async (transaction: any) => get().getConnectorProxy().signTransaction(transaction),
			sendTransaction: async (transaction: any) => get().getConnectorProxy().sendTransaction(transaction),
			waitForTransactionReceipt: async (hash: string, timeout?: number) =>
				get().getConnectorProxy().waitForTransactionReceipt(hash, timeout),
			readContract: async (params: IContractOptions) => get().getConnectorProxy().readContract(params),
			writeContract: async (params: IContractOptions) => get().getConnectorProxy().writeContract(params),
			multipleRequest: async (requests: { method: string; params?: any[] }[]) =>
				get().getConnectorProxy().multipleRequest(requests),
			multicall: async (requests: IContractOptions[], option: MulticallOption) =>
				get().getConnectorProxy().multicall(requests, option),
			switchNetwork: async (chainId: number | string) => get().getConnectorProxy().switchNetwork(chainId)
		}),
		{
			name: 'WALLET_HELPER_STORE',
			storage: createJSONStorage(() => localStorage),
			partialize: state => ({
				currentChainType: state.currentChainType,
				connectStatus: state.connectStatus,
				walletAddress: state.walletAddress,
				currentConnectorName: state.currentConnectorName,
				supportWallets: state.supportWallets,
				currentNetworkId: state.currentNetworkId,
				currentNetwork: state.currentNetwork
			})

			// onRehydrateStorage: () => async state => {}
		}
	)
);
