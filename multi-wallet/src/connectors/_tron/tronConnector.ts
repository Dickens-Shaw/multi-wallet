import { type IContractOptions, type WalletInfo } from '@type/connector';
import { BaseConnector } from '../baseConnector';
import { encodeFunctionData, decodeFunctionResult } from 'viem';

export enum ChainIds {
	mainnet = '0x2b6653dc',
	nile = '0xcd8690dc',
	shasta = '0x94a9059e'
}

export abstract class TronConnector extends BaseConnector {
	constructor(info: WalletInfo, provider?: any) {
		super(info, provider);
	}

	public handleTronLinkEvent = (e: MessageEvent<any>) => {
		const message = e.data?.message;
		if (!e.data?.message) return;
		// console.log('TRON------message', message);
		if (message?.action === 'connect') {
			this.__onConnect();
		} else if (message?.action === 'accountsChanged' && message?.data?.address) {
			this.__onAccountsChanged(message);
		} else if (message?.action === 'setNode' && message?.data?.node) {
			this.__onChainChanged(message);
		} else if (message?.action === 'disconnect') {
			this.__onDisconnect();
		}
	};

	addEventListener = () => {
		window.addEventListener('message', this.handleTronLinkEvent);
	};

	removeEventListener = () => {
		window.removeEventListener('message', this.handleTronLinkEvent);
	};

	connect = async () => {
		try {
			const provider = this.getProvider();
			this.addEventListener();
			this.beforeConnecting();
			const res = await provider.request({ method: 'tron_requestAccounts' });
			// console.log('TRON------res', res);
			if (res.code !== 200) {
				this.connectError();
				throw new Error(res?.msg || 'Connect failed');
			}
			const address = this.getAccounts();
			this.connectSuccess(address);

			return address;
		} catch (err) {
			// console.log('TRON------err', err);
			this.removeEventListener();
			this.connectError();
			throw err;
		}
	};

	reconnection = async () => {
		const provider = this.getProvider();
		const address = provider?.tronWeb?.defaultAddress?.base58;
		if (address) {
			this.connectSuccess(address);
		}
	};

	disconnect = async () => {
		this.__onDisconnect();
	};

	getAccounts = () => {
		const provider = this.getProvider();
		return provider.tronWeb?.defaultAddress?.base58;
	};

	__onAccountsChanged = (message: any) => {
		// console.log('TRON------__onAccountsChanged', message.data.address);
		// TODO: should change or not?
		this.connectSuccess(message.data.address);
		this.walletEventEmitter.emit('accountsChanged', message.data.address);
	};
	__onChainChanged = (message: any) => {
		this.walletEventEmitter.emit('setNode', message?.data?.node);
	};
	__onConnect = () => {
		const address = this.getAccounts();
		this.walletEventEmitter.emit('connect', address);
	};
	__onDisconnect = () => {
		this.resetStatus();
		this.removeEventListener();
		this.walletEventEmitter.emit('disconnect');
	};

	signMessage = async (message: string) => {
		const provider = this.getProvider();
		// console.log(provider.tronWeb);
		const signedString = await provider.tronWeb?.trx.signMessageV2(message);
		// console.log(signedString);
		return signedString;
	};

	signTransaction = async (transaction: any) => {
		const { to, value } = transaction;
		const provider = this.getProvider();
		const tronWeb = provider.tronWeb;
		// console.log('sendTransaction', transaction);
		try {
			const tx = await tronWeb.transactionBuilder.sendTrx(to, value, this.walletAddress);
			const signedTx = await tronWeb.trx.sign(tx);
			// console.log('signedTx', signedTx);
			return signedTx;
		} catch (e) {
			// console.log('signTransaction:err', e);
		}
	};

	sendTransaction = async (transaction: any) => {
		const provider = this.getProvider();
		const tronWeb = provider.tronWeb;
		try {
			const signedTx = await this.signTransaction(transaction);
			const res = await tronWeb.trx.sendRawTransaction(signedTx);
			// console.log(res);
			return res;
		} catch (e) {
			// console.log('sendTransaction:err', e);
		}
	};

	readContract = async (params: IContractOptions) => {
		// console.log('readContract-', params);
		const { abi, address, functionName, args = [], rpcUrl, from } = params;
		try {
			const network = this.store.getState().currentNetwork;
			// console.log('rpcUrl----', params, rpcUrl || network?.rpcUrls[0]);
			const rpc = rpcUrl || network?.rpcUrls[0] || '';
			const data = encodeFunctionData({
				abi,
				functionName,
				args
			});

			const result = await fetch(rpc, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: Math.floor(Math.random() * 100000),
					jsonrpc: '2.0',
					method: 'eth_call',
					params: [from ? { from: from, to: address, data } : { to: address, data }, 'latest']
				})
			});
			// console.log('result---', result);
			const resultJSON = await result.json();
			// console.log('result---', resultJSON);
			if (!resultJSON.result || resultJSON.result === '0x') return result;
			const decodeRes = decodeFunctionResult({
				abi,
				functionName,
				data: resultJSON.result
			});
			// console.log('decodeRes', decodeRes);
			return decodeRes;
		} catch (error) {
			console.error('readContract==', error);
			throw error;
		}
	};

	writeContract = async (params: IContractOptions) => {
		try {
			const provider = this.getProvider();
			const { abi, address, functionName, args, value, options } = params;
			const tronWeb = provider.tronWeb;
			const contract = await tronWeb.contract(abi, address);
			const res =
				args && args.length
					? await contract[functionName](...args).send({
							...options,
							callValue: value
						})
					: await contract[functionName]().send({
							...options,
							callValue: value
						});
			// console.log(res);
			return res;
		} catch (error) {
			// console.log(error);
		}
	};

	waitForTransactionReceipt = async (hash: string, timeout = 60000) => {
		const provider = this.getProvider();
		const startTime = Date.now();
		while (Date.now() - startTime < timeout) {
			const tronWeb = provider.tronWeb;
			// console.log('waitForTransactionReceipt', hash);
			const { receipt } = await tronWeb.trx.getTransactionInfo(hash);
			// console.log('receipt', receipt);
			if (receipt) {
				return receipt;
			}
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	};

	switchNetwork = async (chainId: number) => {
		this.store.getState().setCurrentNetwork(chainId);
	};
}
