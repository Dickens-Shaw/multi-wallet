import type { EIP6963ProviderDetail } from 'mipd';
import type { ConnectorEventMap, IContractOptions, ITransactionOptions } from '@type/connector';
import { createEmitter, type Emitter } from './createEmitter';
import type { AddEthereumChainParameter, SwitchChainParameter } from '@type/chain';
import {
	ProviderRpcError,
	ResourceUnavailableRpcError,
	type RpcError,
	SwitchChainError,
	UserRejectedRequestError
} from '../../errors/rpc';
import { numberToHex, encodeFunctionData, stringToHex, getAddress, decodeFunctionResult } from 'viem';
import { uid } from '@utils/uid';
import { BaseConnector } from '../baseConnector';
import { ConnectorType } from '@type/connector';
import { ChainType } from '@type/chain';
import BigNumber from 'bignumber.js';

declare global {
	interface Window {
		solana: any;
	}
}

export class EvmConnector extends BaseConnector {
	private emitter: Emitter<ConnectorEventMap>;
	public id: string;
	public uid: string;
	public config: any;
	private $_accountsChanged: EvmConnector['__onAccountsChanged'] | undefined;
	private $_chainChanged: EvmConnector['__onChainChanged'] | undefined;
	private $_connect: EvmConnector['__onConnect'] | undefined;
	private $_disconnect: EvmConnector['__onDisconnect'] | undefined;

	constructor(detail: EIP6963ProviderDetail) {
		super(detail.info, detail.provider);

		this.id = detail.info.rdns;
		this.uid = uid();
		this.emitter = createEmitter<ConnectorEventMap>(this.uid);
		this.connectorType = ConnectorType.Installed;

		window.walletProvider = {
			...(window.walletProvider ?? {}),
			[this.name]: this
		};
		window.addEventListener('load', () => {
			const { walletConnectName, isWalletConnected } = localStorage;
			const connected = JSON.parse(isWalletConnected ?? (false as any));
			if (connected && walletConnectName === this.name) this.setIsConnected();
		});
	}

	private readonly addEventListener = (provider: any) => {
		if (this.$_connect) {
			provider.removeListener('connect', this.$_connect);
			this.$_connect = undefined;
		}
		if (!this.$_accountsChanged) {
			this.$_accountsChanged = this.__onAccountsChanged.bind(this);
			provider.on('accountsChanged', this.$_accountsChanged);
		}

		if (!this.$_chainChanged) {
			this.$_chainChanged = this.__onChainChanged.bind(this);
			provider.on('chainChanged', this.$_chainChanged);
		}
		if (!this.$_disconnect) {
			this.$_disconnect = this.__onDisconnect.bind(this);
			provider.on('disconnect', this.$_disconnect);
		}
	};
	private readonly removeEventListener = (provider: any) => {
		if (this.$_accountsChanged) {
			provider.removeListener('accountsChanged', this.$_accountsChanged);
			this.$_accountsChanged = undefined;
		}
		if (this.$_chainChanged) {
			provider.removeListener('chainChanged', this.$_chainChanged);
			this.$_chainChanged = undefined;
		}
		if (this.$_disconnect) {
			provider.removeListener('disconnect', this.$_disconnect);
			this.$_disconnect = undefined;
		}
	};

	private setIsConnected = async () => {
		const walletAddress = (await this.getAccounts())?.[0];
		const info = { name: this.name, address: walletAddress, isConnected: !!walletAddress };
		const walletEvent = new Event('WalletChange') as any;
		walletEvent.info = info;
		walletEvent.provider = this.provider;
		window.dispatchEvent(walletEvent);
	};

	connect = async () => {
		const provider = this.getProvider();
		const networkId = await this.getNetworkId();
		let chainId;
		let shouldSwitchNetwork = false;
		try {
			this.beforeConnecting();
			const accounts: readonly string[] | any = await provider.request({
				method: 'eth_requestAccounts'
			});
			chainId = await this.getChainId();
			shouldSwitchNetwork = chainId !== networkId;
			if (shouldSwitchNetwork) {
				await this.switchNetwork(networkId);
			}
			const address = accounts[0];
			this.connectSuccess(address);
			this.addEventListener(provider);

			localStorage.setItem('isWalletConnected', 'true');
			this.setIsConnected();
			this.walletEventEmitter.emit('connect', address);
			return address;
		} catch (err) {
			this.connectError();
			if (shouldSwitchNetwork) {
				this.store.getState().setCurrentNetwork(Number(chainId));
			}
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			if (error.code === ResourceUnavailableRpcError.code) throw new ResourceUnavailableRpcError(error);
			throw error;
		}
	};

	reconnection = async () => {
		try {
			const provider = this.getProvider();
			const accounts = await this.getAccounts();
			const address = accounts[0];
			if (address) {
				this.connectSuccess(address);
				this.addEventListener(provider);
			} else {
				this.disconnect();
			}
		} catch (err) {
			console.error(err);
		}
	};

	disconnect = async () => {
		const provider = this.getProvider();
		// okx
		provider?.disconnect?.();
		// metamask and other
		provider?.request({
			method: 'wallet_revokePermissions',
			params: [
				{
					eth_accounts: {}
				}
			]
		});

		this.resetStatus();
		this.removeEventListener(provider);

		localStorage.setItem('isWalletConnected', 'false');
		this.setIsConnected();
	};

	getAccounts = async () => {
		const provider = this.getProvider();
		return await provider.request({ method: 'eth_accounts' });
	};

	getChainId = async () => {
		const provider = this.getProvider();
		const hexChainId = await provider.request({ method: 'eth_chainId' });
		return Number(hexChainId);
	};

	switchChain = async ({ addEthereumChainParameter, chainId }: SwitchChainParameter) => {
		const provider = this.getProvider();

		const chain = this.config.chains.find((x: any) => x.id === chainId);
		// if (!chain) throw new SwitchChainError(new Error('ChainNotConfiguredError'));

		try {
			await Promise.all([
				provider
					.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: numberToHex(chainId) }]
					})
					// During `'wallet_switchEthereumChain'`, MetaMask makes a `'net_version'` RPC call to the target chain.
					// If this request fails, MetaMask does not emit the `'chainChanged'` event, but will still switch the chain.
					// To counter this behavior, we request and emit the current chain ID to confirm the chain switch either via
					// this callback or an externally emitted `'chainChanged'` event.
					// https://github.com/MetaMask/metamask-extension/issues/24247
					.then(async () => {
						const currentChainId = await this.getChainId();
						if (currentChainId === chainId) this.emitter.emit('change', { chainId });
					}),
				new Promise<void>(resolve => {
					const listener = ((data: any) => {
						if ('chainId' in data && data.chainId === chainId) {
							this.emitter.off('change', listener);
							resolve();
						}
					}) satisfies Parameters<typeof this.emitter.on>[1];
					this.emitter.on('change', listener);
				})
			]);
			return chain;
		} catch (err) {
			const error = err as RpcError;

			// Indicates chain is not added to provider
			if (
				error.code === 4902 ||
				// Unwrapping for MetaMask Mobile
				// https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
				(error as ProviderRpcError<{ originalError?: { code: number } }>)?.data?.originalError?.code === 4902
			) {
				try {
					const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
					let blockExplorerUrls: string[] | undefined;
					if (addEthereumChainParameter?.blockExplorerUrls)
						blockExplorerUrls = addEthereumChainParameter.blockExplorerUrls;
					else if (blockExplorer)
						blockExplorerUrls = [blockExplorer.url, ...Object.values(blockExplorers).map((x: any) => x.url)];

					let rpcUrls: string[];
					if (addEthereumChainParameter?.rpcUrls?.length) rpcUrls = addEthereumChainParameter.rpcUrls;
					else rpcUrls = [chain.rpcUrls.default?.http[0] ?? ''];

					const addEthereumChain = {
						blockExplorerUrls,
						chainId: numberToHex(chainId),
						chainName: addEthereumChainParameter?.chainName ?? chain.name,
						iconUrls: addEthereumChainParameter?.iconUrls,
						nativeCurrency: addEthereumChainParameter?.nativeCurrency ?? chain.nativeCurrency,
						rpcUrls
					} satisfies AddEthereumChainParameter;

					await provider.request({
						method: 'wallet_addEthereumChain',
						params: [addEthereumChain]
					});

					const currentChainId = await this.getChainId();
					if (currentChainId !== chainId)
						throw new UserRejectedRequestError(new Error('User rejected switch after adding network.'));

					return chain;
				} catch (error) {
					throw new UserRejectedRequestError(error as Error);
				}
			}

			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw new SwitchChainError(error);
		}
	};

	__onConnect = async () => {};

	__onAccountsChanged = (addresses: string[]) => {
		const address = addresses?.[0];
		// console.log('debug:__onAccountsChanged', address);
		if (!address) {
			this.__onDisconnect();
		} else {
			this.connectSuccess(address);
			this.walletEventEmitter.emit('accountsChanged', address);
		}
	};

	__onChainChanged = async (chainId: string) => {
		this.store.getState().setCurrentNetwork(Number(chainId));
		// console.log('debug:__onChainChanged', chainId, network);
		this.walletEventEmitter.emit('chainChanged', chainId);
	};

	__onDisconnect = () => {
		// console.log('debug:__onDisconnect');
		this.disconnect();
		this.walletEventEmitter.emit('disconnect');
	};

	signMessage = async (message: string) => {
		const provider = this.getProvider();
		try {
			const formattedMessage = stringToHex(message);
			return await provider.request({
				method: 'personal_sign',
				params: [formattedMessage, this.walletAddress]
			});
		} catch (err) {
			// console.log('evmConnector:signMessage--------------------', err);
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};

	multipleRequests = async (requests: { method: string; params?: any[] }[]) => {
		const provider = this.getProvider();
		try {
			return await Promise.all(
				requests.map(request =>
					provider.request({
						chainType: ChainType.EVM,
						method: request.method,
						params: request.params
					})
				)
			);
		} catch (err) {
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};

	// signTransaction = async (transaction: ITransactionOptions) => {
	// 	const provider = this.getProvider();
	// 	try {
	// 		return await provider.request({
	// 			method: 'eth_signTransaction',
	// 			params: [transaction]
	// 		});
	// 	} catch (err) {
	// 		// console.log('evmConnector:signTransaction--------------------', err);
	// 		const error = err as RpcError;
	// 		if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
	// 		throw error;
	// 	}
	// };

	sendTransaction = async (transaction: ITransactionOptions) => {
		const provider = this.getProvider();
		if (transaction.value) {
			transaction.value = BigNumber(transaction.value).gt(0) ? transaction.value : '0x0';
		}

		try {
			return await provider.request({
				chainType: ChainType.EVM,
				method: 'eth_sendTransaction',
				params: [transaction]
			});
		} catch (err) {
			// console.log('evmConnector:sendTransaction--------------------', err);
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};

	waitForTransactionReceipt = async (hash: string, timeout = 60000) => {
		const provider = this.getProvider();
		const startTime = Date.now();

		while (Date.now() - startTime < timeout) {
			try {
				const receipt = await provider.request({
					chainType: ChainType.EVM,
					method: 'eth_getTransactionReceipt',
					params: [hash]
				});

				if (receipt) return receipt;

				await new Promise(resolve => setTimeout(resolve, 1000));
			} catch (err) {
				// console.log('evmConnector:waitForTransactionReceipt--------------------', err);
				const error = err as RpcError;
				throw error;
			}
		}

		throw new Error('Transaction receipt timeout');
	};

	readContract = async (params: IContractOptions) => {
		try {
			const { abi, address, functionName, args = [], rpcUrl, from } = params;
			const network = this.store.getState().currentNetwork;
			// console.log('rpcUrl---', params, params.rpcUrl || network?.rpcUrls[0]);
			const rpc = rpcUrl || network?.rpcUrls[0] || '';
			const data = encodeFunctionData({
				abi,
				functionName,
				args
			});
			// console.log('data---', data);
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
			const resultJSON = await result.json();
			// console.log('resultJson', resultJSON);
			if (!resultJSON.result || resultJSON.result === '0x') return result;
			const decodeRes = decodeFunctionResult({
				abi,
				functionName,
				data: resultJSON.result
			});
			// console.log('EVM-readContract', decodeRes);
			return decodeRes;
		} catch (err) {
			// console.log('evmConnector:readContract--------------------', err);
			const error = err as RpcError;
			throw error;
		}
	};

	writeContract = async (params: IContractOptions) => {
		const provider = this.getProvider();
		if (params.value) {
			params.value = BigNumber(params.value).gt(0) ? params.value : '0x0';
		}
		try {
			const data = encodeFunctionData({
				abi: params.abi,
				functionName: params.functionName,
				args: params.args || []
			});
			const tx = {
				from: this.walletAddress,
				to: params.address,
				data,
				value: params.value
			};
			const res = await provider.request({
				chainType: ChainType.EVM,
				method: 'eth_sendTransaction',
				params: [tx]
			});
			// console.log(res);
			return res;
		} catch (err) {
			// console.log('evmConnector:writeContract--------------------', err);
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};

	multicall = async (
		params: IContractOptions[],
		option: {
			multicallAddress: string;
			multicallAbi: any;
			rpcUrl: string;
		}
	) => {
		const { multicallAddress, multicallAbi, rpcUrl } = option;
		// console.log('multicall params---', params);
		// console.log('multicall option---', option);

		try {
			// 准备 multicall 的调用数据
			const calls = params.map(param => ({
				target: getAddress(param.address),
				allowFailure: true,
				callData: encodeFunctionData({
					abi: param.abi,
					functionName: param.functionName,
					args: param.args || []
				})
			}));

			// console.log('multicall calls---', calls);

			// 编码 aggregate3 调用
			const multicallData = encodeFunctionData({
				abi: multicallAbi,
				functionName: 'aggregate3',
				args: [calls]
			});

			// console.log('multicall data---', multicallData);
			const network = this.store.getState().currentNetwork;

			console.log('rpcUrl---', rpcUrl || network?.rpcUrls[0]);
			const rpc = rpcUrl || network?.rpcUrls[0] || '';

			// 调用 Multicall3 合约
			const result = await fetch(rpc, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: Math.floor(Math.random() * 100000),
					jsonrpc: '2.0',
					method: 'eth_call',
					params: [
						{
							to: multicallAddress,
							data: multicallData
						},
						'latest'
					]
				})
			});
			// console.log('multicall result---', result);
			const resultJSON = await result.json();
			if (!resultJSON.result || resultJSON.result === '0x') return result;

			const decodedResult: any = decodeFunctionResult({
				abi: multicallAbi,
				functionName: 'aggregate3',
				data: resultJSON.result
			});

			// console.log('multicall decodedResult---', decodedResult);
			const deepDecodeResult = params.map((p: any, index: number) => {
				const i = decodedResult[index];
				if (i.returnData === '0x' && i.success === false) {
					i.returnData = undefined;
					return i;
				}
				const decodeRes = decodeFunctionResult({
					abi: p.abi,
					functionName: p.functionName,
					data: i.returnData
				});
				i.returnData = decodeRes;
				return i;
			});
			// console.log('multicall deepDecodeResult---', deepDecodeResult);

			return deepDecodeResult;
		} catch (err) {
			// console.log('evmConnector:multicall--------------------', err);
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};

	switchNetwork = async (chainId: number) => {
		const provider = this.getProvider();
		try {
			const res = await provider.request({
				chainType: ChainType.EVM,
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: numberToHex(chainId) }]
			});
			this.store.getState().setCurrentNetwork(Number(chainId));
			console.log('switchNetwork', res);
		} catch (err: any) {
			console.log('evmConnector:switchNetwork--------------------', err);
			if (err?.code === 4902) {
				const network = this.supportedNetworks.find(item => item.chainId === chainId);
				if (network) {
					const params = {
						...network,
						chainId: numberToHex(network?.chainId)
					};
					await provider.request({
						method: 'wallet_addEthereumChain',
						params: [params]
					});
				}
				return;
			}
			const error = err as RpcError;
			if (error.code === UserRejectedRequestError.code) throw new UserRejectedRequestError(error);
			throw error;
		}
	};
}
