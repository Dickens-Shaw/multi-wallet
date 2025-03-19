import { GelWalletConnector } from '../_gel/gelConnector';
import { type WalletInfo, type IContractOptions } from '@type/connector';
import { ChainType } from '@web3jskit/type';
import { numberToHex, encodeFunctionData, getAddress, decodeFunctionResult } from 'viem';
import { type RpcError, UserRejectedRequestError } from '../../errors/rpc';

export default class GelWalletEvmConnector extends GelWalletConnector {
	constructor(info: WalletInfo) {
		super(info, ChainType.EVM);
	}

	connect = async (chainId?: string): Promise<string> => {
		try {
			const provider = await this.getProvider();
			this.addEventListener();
			this.beforeConnecting();
			// console.log(this.store.getState().currentNetworkId);
			const res = await provider.request({
				method: 'eth_requestAccounts',
				params: [
					{
						chainId: chainId || numberToHex(this.store.getState().currentNetworkId)
					}
				]
			});
			const address = res[0];
			this.connectSuccess(address);
			return address;
		} catch (error) {
			this.removeEventListener();
			this.connectError();
			throw error;
		}
	};
	reconnection = async () => {
		try {
			const provider = await this.getProvider();
			this.addEventListener();
			this.beforeConnecting();
			const res = await provider.request({
				method: 'eth_accounts'
			});
			const address = res[0];
			if (address) {
				this.connectSuccess(address);
			} else {
				this.__onDisconnect();
			}
		} catch (error) {
			this.removeEventListener();
			this.connectError();
		}
	};
	disconnect = async () => {
		this.__onDisconnect();
	};

	// same as ../_evm/evmConnector.ts
	signMessage = async (message: string): Promise<string> => {
		const provider = await this.getProvider();
		const res = await provider.request({
			method: 'personal_sign',
			params: [message, this.walletAddress]
		});
		return res;
	};
	signTransaction = async (tx: any): Promise<string> => {
		const provider = await this.getProvider();
		try {
			const res = await provider.request({
				method: 'eth_signTransaction',
				params: [tx]
			});
			// console.log(res);
			return res;
		} catch (error) {
			console.error('signTransaction:error', error);
			throw error;
		}
	};
	sendTransaction = async (tx: any): Promise<string> => {
		const provider = await this.getProvider();
		const res = await provider.request({
			method: 'eth_sendTransaction',
			params: [tx]
		});
		return res;
	};
	multipleRequests = async (requests: { method: string; params?: string[] }[]): Promise<any[]> => {
		const provider = await this.getProvider();
		const results = await await provider.multipleRequest({
			chainType: ChainType.EVM,
			events: requests
		});
		return results;
	};

	waitForTransactionReceipt = async (hash: string, timeout = 60000) => {
		const provider = await this.getProvider();
		const startTime = Date.now();

		while (Date.now() - startTime < timeout) {
			try {
				const receipt = await provider.request({
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
		const provider = await this.getProvider();
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
			return await provider.request({
				method: 'eth_sendTransaction',
				params: [tx]
			});
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

			const network = this.store.getState().currentNetwork;
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
		const provider = await this.getProvider();
		try {
			await provider.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: numberToHex(chainId) }]
			});
			// console.log('switchNetwork', res);
		} catch (err: any) {
			// console.log('evmConnector:switchNetwork--------------------', err);
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
