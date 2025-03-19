import type { WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';

const generateDeepLinkProvider = (info: WalletInfo) => {
	return {
		request: async ({ method, params }: any) => {
			console.log('Tron-----request', method, params);
			return new Promise(() => {
				if (method === 'openDApp') {
					const url = `${info.deepLink}?param=${encodeURIComponent(
						JSON.stringify({
							url: window?.location.href,
							action: 'open',
							protocol: 'tronlink',
							version: '1.0'
						})
					)}`;
					console.log('Tron-----deepLink', url);
					window.location.href = url;
				}
			});
		}
	};
};

export default class TronLinkDeepLinkConnector extends BaseConnector {
	constructor(info: WalletInfo) {
		const provider = generateDeepLinkProvider(info);
		super(info, provider);

		this.deepLink = info.deepLink;
	}

	connect = async () => {
		const provider = this.getProvider();

		try {
			this.beforeConnecting();
			provider.request({ method: 'openDApp' });
			this.resetStatus();
			return Promise.resolve('');
		} catch (err) {
			this.resetStatus();
			return Promise.reject(err);
		}
	};

	reconnection = async () => {
		console.log('reconnection');
	};

	disconnect = async () => {
		this.resetStatus();
	};

	switchChain = () => {};

	getAccounts = () => {};

	getChainId = () => {};

	__onAccountsChanged = () => {};

	__onChainChanged = () => {};

	__onConnect = () => {};

	__onDisconnect = () => {};
}
