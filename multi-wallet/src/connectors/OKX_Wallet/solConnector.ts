import { ConnectorType, type WalletInfo } from '@type/connector';
import { SolConnector } from '../_sol/solConnector';

declare global {
	interface Window {
		okxwallet: any;
	}
}

export default class OKXWalletSolConnector extends SolConnector {
	constructor(info: WalletInfo) {
		const provider = window.okxwallet?.solana;
		super(info, provider);
		this.connectorType = provider ? ConnectorType.Installed : ConnectorType.More;
	}
}
