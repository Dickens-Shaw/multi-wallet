import { ConnectorType, type WalletInfo } from '@type/connector';
import { TronConnector } from '../_tron/tronConnector';

export enum ChainIds {
	mainnet = '0x2b6653dc',
	nile = '0xcd8690dc',
	shasta = '0x94a9059e'
}

export default class TronLinkTronConnector extends TronConnector {
	constructor(info: WalletInfo) {
		const provider = window.okxwallet?.tronLink;
		super(info, window.okxwallet?.tronLink);
		this.connectorType = provider ? ConnectorType.Installed : ConnectorType.More;
	}
}
