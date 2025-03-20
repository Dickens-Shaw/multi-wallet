'use client';
import { createContext, type ReactNode, useEffect, useMemo } from 'react';
import { ChainType } from '@type/chain';
import { useWalletKit } from '@hooks/useWalletKit';
import type { SupportWallet } from '@/config/walletConfig';
import type { NetworkInfo } from '@/types/net';
import { createConnector } from '@/connectors/createConnectors';
import { ConnectStatus, type Connector } from '@/types/connector';

interface IChainProvider {
	children: ReactNode;
	defaultChainType?: ChainType;
	defaultChainId?: number;
	reconnect?: boolean;
	supportWallets?: SupportWallet[];
	customEvmNetworks?: NetworkInfo[];
	isTokenUp?: boolean;
	showNetwork?: boolean;
}

interface ChainContextValue {
	defaultChainType?: ChainType;
	defaultChainId?: number;
	supportWallets?: SupportWallet[];
	isTokenUp?: boolean;
	showNetwork?: boolean;
}

export const ChainContext = createContext<ChainContextValue>({
	defaultChainType: ChainType.EVM,
	defaultChainId: 1,
	supportWallets: [],
	isTokenUp: false,
	showNetwork: false
});

export function ChainProvider({
	children,
	defaultChainType = ChainType.EVM,
	defaultChainId = 1,
	reconnect,
	supportWallets,
	customEvmNetworks,
	isTokenUp,
	showNetwork
}: IChainProvider) {
	const {
		connectStatus,
		currentChainType,
		currentConnectorName,
		currentNetworkId,
		getSupportNets,
		resetStatus,
		setChainType,
		setCurrentConnector,
		setCurrentNetwork,
		setCustomEvmNetworks,
		setProvider,
		setSupportWallets,
		switchNetwork
	} = useWalletKit();

	const getConnectors = async (chainType: ChainType = ChainType.EVM) => {
		console.log('getConnectors', chainType, supportWallets, isTokenUp);
		const connectors = await createConnector(chainType, supportWallets || [], isTokenUp);
		return connectors;
	};

	const reconnectConnectors = async (chainType: ChainType = ChainType.EVM) => {
		const connectors = await getConnectors(chainType);
		const curConnect: Connector = connectors.find((connector: Connector) => connector.name === currentConnectorName);
		if (curConnect) {
			setCurrentConnector(curConnect);
			setProvider(curConnect.provider);
			curConnect.reconnection();
		} else {
			resetStatus();
		}
	};

	const getNetwork = (chainId: number) => {
		const networks = getSupportNets();
		return networks.find(item => item.chainId === chainId);
	};

	const handleInit = async () => {
		setSupportWallets(supportWallets || []);
		setCustomEvmNetworks(customEvmNetworks || []);
		if (connectStatus === ConnectStatus.Connected) {
			reconnect && (await reconnectConnectors(currentChainType));
			const network = getNetwork(currentNetworkId);
			network && switchNetwork(network.chainId);
		} else {
			setChainType(defaultChainType);
			getConnectors(defaultChainType);
			const network = getNetwork(defaultChainId);
			network && setCurrentNetwork(network.chainId);
		}
	};

	useEffect(() => {
		handleInit();
	}, []);

	const chainValue = useMemo(() => {
		return {
			defaultChainType,
			defaultChainId,
			supportWallets,
			isTokenUp,
			showNetwork
		};
	}, [defaultChainType, defaultChainId, supportWallets, isTokenUp, showNetwork]);

	return <ChainContext.Provider value={chainValue}>{children}</ChainContext.Provider>;
}
