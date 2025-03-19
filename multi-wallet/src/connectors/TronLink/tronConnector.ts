import { ConnectorType, type WalletInfo } from '@type/connector';
import { TronConnector } from '../_tron/tronConnector';

export enum ChainIds {
	mainnet = '0x2b6653dc',
	nile = '0xcd8690dc',
	shasta = '0x94a9059e'
}

export default class TronLinkTronConnector extends TronConnector {
	constructor(info: WalletInfo) {
		const provider = window.tron;
		super(info, provider);
		this.connectorType = provider && window.tron?.isTronLink ? ConnectorType.Installed : ConnectorType.More;
	}

	override connect = async () => {
		try {
			const provider = this.getProvider();
			this.addEventListener();
			this.beforeConnecting();
			const res = await provider.request({ method: 'eth_requestAccounts' });
			// console.log('TRON------res', res);
			const address = res[0];
			// console.log('TRON------address', address);

			this.connectSuccess(res[0]);

			return address;
		} catch (err) {
			// console.log('TRON------err', err);
			this.removeEventListener();
			this.connectError();
			throw err;
		}
	};
}
