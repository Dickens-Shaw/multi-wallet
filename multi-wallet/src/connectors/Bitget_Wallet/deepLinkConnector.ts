import type { WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';

const generateDeepLinkProvider = (info: WalletInfo) => {
	return {
		request: async ({ method, params }: any) => {
			return new Promise(() => {
				console.log('Bitget------request', method, params);
				if (method === 'openDApp') {
					const url = `${info.deepLink}?action=dapp&url=${window.location.href}`;
					console.log('Bitget------deepLink', url);
					window.location.href = url;
				}
			});
		}
	};
};

export default class BitgetDeepLinkConnector extends BaseConnector {
	constructor(info: WalletInfo) {
		const provider = generateDeepLinkProvider(info);
		super(info, provider);

		this.deepLink = info.deepLink;
	}

	connect = async () => {
		const provider = this.getProvider();
		try {
			this.beforeConnecting();
			await provider.request({ method: 'openDApp' });
			this.resetStatus();
			return Promise.resolve('');
		} catch (err) {
			console.error(err);
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

	getAccounts = () => {};

	__onAccountsChanged = () => {};

	__onChainChanged = () => {};

	__onConnect = () => {};

	__onDisconnect = () => {};
}

// var deeplinkUrl: String {
// 	let originatorInfo = OriginatorInfo(
// 		title: appMetadata?.name,
// 		url: appMetadata?.url,
// 		icon: appMetadata?.iconUrl ?? appMetadata?.base64Icon,
// 		dappId: SDKInfo.bundleIdentifier,
// 		platform: SDKInfo.platform,
// 		apiVersion: SDKInfo.version
// 	)
// 	let originatorInfoBase64 = originatorInfo.toJsonString()?.base64Encode() ?? ""
// 	let rpcBase64: String? = connectRpc?.base64Encode() ?? nil

// 	var deeplink = "\(_deeplinkUrl)/connect?channelId="
// 		+ channelId
// 		+ "&comm=socket"
// 		+ "&pubkey="
// 		+ keyExchange.pubkey
// 		+ "&v=2"
// 		+ "&originatorInfo=\(originatorInfoBase64)"

// 	if let requestBase64 = rpcBase64 {
// 		deeplink += "&rpc=\(requestBase64)"
// 		connectRpc = nil // reset rpc request
// 	}
// 	return deeplink
// }

// export const setDeepLinks = {
// 	dapp: 'https://metamask.app.link/dapp/https%3A%2F%2Fwww.google.com',
// 	connect: 'https://metamask.app.link/connect?channelId=4cddce59-c4ea-4c70-9dbf-d1ddbe8f7a9f&comm=socket&pubkey=BCCKuS6Z26iZkxA1oB69X9DN73dlCYEQa46d0id8MCXdshRHGqI4rVuIeXjMS2vrlq7PkD4nbzb7gEFn%2FJfHz4E%3D',
// 	sendDeeplinkButton:
// 		'https://metamask.app.link/send/0x0c54FcCd2e384b4BB6f2E405Bf5Cbc15a017AaFb?value=0',
// 	transferTokensDeeplink: 'https://metamask.app.link/send/${deployedContractAddress}/transfer?address=0x2f318C334780961FB129D2a6c30D0763d9a5C970&uint256=4e${tokenDecimals}',
// 	approveTokensDeeplink: 'https://metamask.app.link/approve/${deployedContractAddress}/approve?address=0x178e3e6c9f547A00E33150F7104427ea02cfc747&uint256=3e${tokenDecimals}',
// 	maliciousSendEthWithDeeplink: 'https://metamask.app.link/send/${maliciousAddress}?value=0',
// 	maliciousTransferERC20WithDeeplink: 'https://metamask.app.link/send/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48@1/transfer?address=${maliciousAddress}&uint256=1e6',
// 	maliciousApproveERC20WithDeeplink: 'https://metamask.app.link/approve/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48@1/approve?address=${maliciousAddress}&uint256=1e6',
// 	payment: 'https://metamask.app.link/payment/${target}?amount=${amount}&detail=${encodeURIComponent(detail)}',
// };
