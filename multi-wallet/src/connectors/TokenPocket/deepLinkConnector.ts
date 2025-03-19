import type { WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';

const generateDeepLinkProvider = (info: WalletInfo) => {
	return {
		request: async ({ method, params }: any) => {
			console.log('TokenPocket-----request', method, params);
			return new Promise(() => {
				if (method === 'openDApp') {
					const url = `${info.deepLink}?param=${encodeURIComponent(
						JSON.stringify({
							url: window?.location.href
							// chain: 'EOS', // dapp支持的网络
							// "source": "xxx", // 来源，开发者自定义
						})
					)}`;
					console.log('TokenPocket-----deepLink', url);
					window.location.href = url;
				}
			});
		}
	};
};

export default class TokenPocketDeepLinkConnector extends BaseConnector {
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
