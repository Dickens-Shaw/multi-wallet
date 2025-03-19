import { ConnectorType, type WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';
import { ChainType } from '@web3jskit/type';
import { SupportWallet } from '@config/walletConfig';

declare global {
	interface Window {
		Web3Kit: any;
		bs58?: any;
	}
}

export abstract class GelWalletConnector extends BaseConnector {
	public instance: any;
	private isTokenUp: boolean;
	constructor(info: WalletInfo, chainType: ChainType) {
		super(info, null);
		this.isTokenUp = info.name === SupportWallet.TOKENUP;
		this.chainType = chainType;
		this.connectorType = ConnectorType.Run;
	}
	override getProvider = async () => {
		let provider: any;
		if (this.provider) {
			provider = this.provider;
		} else {
			// async import Web3Kit
			let dep;
			// console.log('this.isTokenUp-------', this.isTokenUp);
			if (this.isTokenUp) {
				dep = await import('@tokenup/web3kit');
			} else {
				dep = await import('@web3jskit/dapp');
			}
			const Web3Kit = dep.Web3Kit;
			const providerName = this.chainType?.toLowerCase() as keyof typeof dep.Web3Kit.prototype.provider;
			if (!window.Web3Kit._instance) {
				Web3Kit.config({
					hideEvokingButton: false,
					takeover: {
						ethereum: true,
						solana: true,
						...(this.isTokenUp ? { hc: true } : { put: true })
					}
				});
				const instance = new Web3Kit();
				// console.log('-------instance', instance);
				this.instance = instance;
				provider = await new Promise(resolve => {
					const checkProvider = () => {
						if (instance.provider && instance.provider[providerName]) {
							// console.log(instance.provider, providerName);
							resolve(instance.provider[providerName]);
						} else {
							setTimeout(checkProvider, 100);
						}
					};
					checkProvider();
				});
				if (this.chainType === ChainType.EVM) {
					const originRequest = provider.request;
					const proxyRequest = async ({ methodName, ...arr }: { methodName: string; arr: any }) => {
						// console.log('proxyRequest', this.chainType, methodName, arr);
						return await originRequest({
							chainType: this.chainType,
							methodName,
							...arr
						});
					};
					provider.request = proxyRequest;
				}
			} else {
				provider = window.Web3Kit._instance.provider[providerName];
			}
			this.provider = provider;
			// console.log('gel', this.provider);
		}
		return this.provider || {};
	};

	addEventListener = async () => {
		window.addEventListener('message', this.handleWeb3KitEvent);
	};

	removeEventListener = async () => {
		window.removeEventListener('message', this.handleWeb3KitEvent);
	};

	private handleWeb3KitEvent = (e: MessageEvent<any>) => {
		const eventData = e.data;
		if (eventData.target !== 'jsweb3-did') return;
		if (eventData.eventName === 'disconnect') {
			this.__onDisconnect();
		} else if (eventData.eventName === 'accountsChanged') {
			this.__onAccountsChanged(eventData);
		} else if (eventData.eventName === 'chainChanged') {
			this.__onChainChanged(eventData);
		}
	};

	__onAccountsChanged = (eventData: any) => {
		const isConnectedAccounts = eventData.data.connectedWebs?.find((item: any) => {
			return item.net.chainType === this.chainType;
		});
		// console.log('GEL------accountsChanged---connectedWebs', eventData.data.connectedWebs, isConnectedAccounts);
		if (!isConnectedAccounts) {
			return;
		}
		const address = eventData.data?.account?.seriesWallets?.[this.chainType as string]?.walletAddress;
		// console.log('GEL------accountsChanged---seriesWallets', eventData.data?.account?.seriesWallets, address);
		if (address) {
			this.connectSuccess(address);
			this.walletEventEmitter.emit('accountsChanged', address);
		}
	};
	__onChainChanged = (eventData: any) => {
		// console.log('GEL------chainChanged---net', eventData.data.net);
		this.walletEventEmitter.emit('chainChanged', eventData.data.net);
	};
	__onConnect = () => {};
	__onDisconnect = () => {
		this.resetStatus();
		this.removeEventListener();
		this.walletEventEmitter.emit('disconnect');
	};

	abstract signMessage(message: string): Promise<string>;
	abstract signTransaction(transaction: any): Promise<string>;
	abstract sendTransaction(transaction: any): Promise<any>;
}
