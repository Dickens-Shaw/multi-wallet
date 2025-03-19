import { ConnectorType, type WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';

declare global {
	interface Window {
		phantom: any;
	}
}

export default class PhantomConnector extends BaseConnector {
	constructor(info: WalletInfo) {
		const provider = window.phantom?.bitcoin;
		super(info, provider);

		this.connectorType = window.phantom?.bitcoin ? ConnectorType.Installed : ConnectorType.More;
	}

	private addEventListener = async () => {
		const provider = this.getProvider();
		provider.on('accountsChanged', (accounts: any) => {
			// console.log('Phantom------accountsChanged', accounts);
			const address = accounts[0]?.address;
			if (address) {
				this.connectSuccess(address);
			} else {
				this.disconnect();
			}
		});
	};

	private removeEventListener = async () => {
		const provider = this.getProvider();
		provider.off('accountsChanged', () => {});
	};

	connect = async () => {
		const provider = this.getProvider();
		try {
			this.beforeConnecting();
			const accounts = await provider.requestAccounts();
			const address = accounts[0].address;
			this.connectSuccess(address);
			this.addEventListener();
			return address;
		} catch (err) {
			this.connectError();
			throw err;
		}
	};

	disconnect = async () => {
		this.resetStatus();
		this.removeEventListener();
	};

	getAccounts = async () => {
		const provider = this.getProvider();
		return provider?.publicKey?.toString?.();
	};

	__onAccountsChanged = () => {};

	__onChainChanged = () => {};

	__onConnect = () => {};

	reconnection = async () => {};

	__onDisconnect = () => {};
}
