import { ConnectorType, type WalletInfo } from '@type/connector';
import { SolConnector } from '../_sol/solConnector';

declare global {
	interface Window {
		phantom: any;
	}
}

export default class PhantomSolConnector extends SolConnector {
	constructor(info: WalletInfo) {
		const provider = window.phantom?.solana;
		super(info, provider);
		this.connectorType = provider && !provider.isBitKeep ? ConnectorType.Installed : ConnectorType.More;
	}
}
