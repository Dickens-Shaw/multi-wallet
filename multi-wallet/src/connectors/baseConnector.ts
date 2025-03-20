import type { ChainType } from '@type/chain';
import type { Connector, WalletInfo } from '@type/connector';
import type { EventName } from '@type/events';
import { ConnectStatus, ConnectorType } from '@type/connector';
import { default as EventEmitter } from 'eventemitter3';
import { walletHelperStore } from '@stores/coreStore';
import type { NetworkInfo } from '@type/net';

export abstract class BaseConnector implements Connector {
	public provider: any;
	public name: string;
	public icon: string;
	public deepLink?: string;
	public walletAddress: string;
	public chainType?: ChainType;
	public chainId?: number;
	public connectorType?: ConnectorType;
	public store?: any;
	public supportedNetworks: NetworkInfo[];
	protected walletEventEmitter: EventEmitter;

	constructor(info: WalletInfo, provider?: any) {
		this.name = info.name;
		this.icon = info.icon;
		this.deepLink = info.deepLink;
		this.walletAddress = '';
		this.provider = provider;
		this.connectorType = ConnectorType.More;
		this.walletEventEmitter = new EventEmitter();
		this.store = walletHelperStore;
		this.supportedNetworks = walletHelperStore.getState().getSupportNets();
	}

	public getNetworkId = async () => {
		return this.store.getState().currentNetworkId;
	};

	public getProvider = () => {
		const provider = this.provider;
		return provider || {};
	};

	public beforeConnecting = async () => {
		this.store.setState({
			isConnecting: {
				icon: this.icon,
				name: this.name
			}
		});
	};

	public connectError = async () => {
		this.store.setState({
			isConnecting: false
		});
	};

	public connectSuccess = async (address: string) => {
		this.walletAddress = address;
		this.store.setState({
			connectStatus: ConnectStatus.Connected,
			walletAddress: address,
			currentConnector: this as any,
			currentConnectorName: this.name,
			provider: this.getProvider(),
			isConnecting: false
		});
	};

	public getWalletAddress = () => {
		return this.walletAddress;
	};

	public resetStatus = async () => {
		this.store.setState({
			connectStatus: ConnectStatus.Disconnected,
			currentConnector: null,
			walletAddress: '',
			provider: null,
			isConnecting: false
		});
	};

	abstract connect(): Promise<string>;
	abstract disconnect(): Promise<void>;
	abstract reconnection(): Promise<void>;
	// wallet events
	// public readonly onConnect = (callback: (address: string) => void) => {
	// 	this.walletEventEmitter.on('connect', callback);
	// };
	public readonly on = <T>(eventName: EventName, callback: (data: T) => void) => {
		this.walletEventEmitter.on(eventName, callback);
	};
	public readonly off = <T>(eventName: EventName, callback: (data: T) => void) => {
		this.walletEventEmitter.off(eventName, callback);
	};
	public readonly once = <T>(eventName: EventName, callback: (data: T) => void) => {
		this.walletEventEmitter.once(eventName, callback);
	};
	// public readonly onDisconnect = (callback: () => void) => {
	// 	this.walletEventEmitter.on('disconnect', callback);
	// };
	// public readonly onAccountsChanged = (callback: (address: string) => void) => {
	// 	this.walletEventEmitter.on('accountsChanged', callback);
	// };
	// public readonly onChainChanged = (callback: (chainId: string) => void) => {
	// 	this.walletEventEmitter.on('chainChanged', callback);
	// };

	// protected readonly emitConnect = (address: string) => {
	// 	this.walletEventEmitter.emit('connect', address);
	// };
	// protected readonly emitDisconnect = () => {
	// 	this.walletEventEmitter.emit('disconnect');
	// };
	// protected readonly emitAccountsChanged = (address: string) => {
	// 	this.walletEventEmitter.emit('accountsChanged', address);
	// };
	// protected readonly emitChainChanged = (chainId: string) => {
	// 	this.walletEventEmitter.emit('chainChanged', chainId);
	// };
}
