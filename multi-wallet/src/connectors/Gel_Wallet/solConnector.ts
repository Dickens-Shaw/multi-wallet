import { type WalletInfo } from '@type/connector';
import { GelWalletConnector } from '../_gel/gelConnector';
import { ChainType } from '@type/chain';

export default class GelWalletSolConnector extends GelWalletConnector {
	constructor(info: WalletInfo) {
		super(info, ChainType.SOL);
	}

	connect = async () => {
		try {
			const provider = await this.getProvider();
			// console.log(provider);
			this.addEventListener();
			this.beforeConnecting();
			const res = await provider.connect();
			const address = res.publicKey.toString();
			this.connectSuccess(address);
			return address;
		} catch (err) {
			this.removeEventListener();
			this.connectError();
			throw err;
		}
	};
	reconnection = async (): Promise<void> => {
		await this.connect();
	};
	disconnect = async () => {
		try {
			const provider = await this.getProvider();
			await provider.disconnect();
			this.__onDisconnect();
		} catch (err) {
			console.error(err);
		}
	};

	switchNetwork = async (chainId: number) => {
		// console.log('switchChain', this.instance, chainId, chainId);
		const params = {
			chainType: ChainType.SOL,
			methodName: 'switchNet',
			params: {
				chainId
			}
		};
		// console.log(params);
		window.Web3Kit._instance.request(params);
	};

	signMessage = async (message: string) => {
		const provider = await this.getProvider();
		const messageBuffer = Buffer.from(message, 'utf8');
		return await provider.signMessage(messageBuffer, 'utf8');
	};

	signTransaction = async (transaction: any) => {
		const provider = await this.getProvider();
		return await provider.signTransaction(transaction);
	};

	signAllTransactions = async (transactions: any[]) => {
		const provider = await this.getProvider();
		return await provider.signAllTransactions(transactions);
	};

	sendTransaction = async (transaction: any, options: any = {}) => {
		const provider = await this.getProvider();
		return await provider.signAndSendTransaction(transaction, options);
	};
}
