import { ConnectorType, type WalletInfo } from '@type/connector';
import { SolConnector } from '../_sol/solConnector';

declare global {
	interface Window {
		bitkeep: any;
	}
}

export default class BitgetSolConnector extends SolConnector {
	constructor(info: WalletInfo) {
		const provider = window.bitkeep?.solana;
		super(info, provider);
		this.connectorType = provider ? ConnectorType.Installed : ConnectorType.More;
	}

	// override signMessage = async (message: string) => {
	// 	const provider = await this.getProvider();
	// 	const encodedMessage = new TextEncoder().encode(message);
	// 	return await provider.signMessage(encodedMessage);
	// };

	override sendTransaction = async (transaction: any, options: any = {}) => {
		const provider = await this.getProvider();
		return await provider.signSendTransaction(transaction, options);
	};
}
