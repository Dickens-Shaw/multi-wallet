import { type WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';

declare global {
	interface Window {
		phantom: any;
		solana: any;
	}
}

export abstract class SolConnector extends BaseConnector {
	constructor(info: WalletInfo, provider?: any) {
		super(info, provider);
	}

	addEventListener = () => {
		const provider = this.getProvider();
		provider.on('connect', this.__onConnect);
		provider.on('accountChanged', this.__onAccountsChanged);
		provider.on('chainChanged', this.__onChainChanged);
		provider.on('disconnect', this.__onDisconnect);
	};

	removeEventListener = () => {
		const provider = this.getProvider();
		provider.off('connect', this.__onConnect);
		provider.off('accountChanged', this.__onAccountsChanged);
		provider.off('chainChanged', this.__onChainChanged);
		provider.off('disconnect', this.__onDisconnect);
	};

	__onAccountsChanged = (e: any) => {
		// console.log('SOL------accountsChanged', e, params);
		const address = e?.toString();
		address && this.connectSuccess(address);
		this.walletEventEmitter.emit('accountChanged', address);
	};
	__onChainChanged = (_: any, ...params: any) => {
		// console.log('SOL------chainChanged', e, params);
		this.walletEventEmitter.emit('chainChanged', params);
	};
	__onConnect = (_: any, ...params: any) => {
		// console.log('SOL------connect', e, params, this.walletEventEmitter);
		this.walletEventEmitter.emit('connect', params);
	};
	__onDisconnect = () => {
		// console.log('SOL------disconnect');
		this.resetStatus();
		this.removeEventListener();
		this.walletEventEmitter.emit('disconnect');
	};

	connect = async () => {
		try {
			const provider = await this.getProvider();
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
	reconnection = async () => {
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

	getAccounts = async () => {
		const provider = await this.getProvider();
		return provider?.publicKey?.toString?.();
	};

	getChainId = async () => {
		const provider = await this.getProvider();
		const chainInfo = await provider.request({ method: 'getClusterNodes', params: [] });
		// console.log(chainInfo);
		return chainInfo;
	};

	switchChain = async () => {
		// console.log('switchChain');
		// cluster: 'devnet' | 'testnet' | 'mainnet-beta'
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

	signAndSendAllTransactions = async (transactions: any[], options: any = {}) => {
		const provider = await this.getProvider();
		return await provider.signAndSendAllTransactions(transactions, options);
	};

	handleNotification = async (event: any) => {
		const provider = await this.getProvider();
		return await provider.handleNotification(event);
	};

	removeAllListeners = async (event: any) => {
		const provider = await this.getProvider();
		return provider.removeAllListeners(event);
	};
}
