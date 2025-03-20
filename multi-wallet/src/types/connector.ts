import { ChainType } from '@type/chain';
import { ProviderRpcError } from '../errors/rpc';
import type { EventName } from './events';

export type WalletInfo = {
	name: string;
	icon: string;
	deepLink?: string;
};

export enum ConnectorType {
	Installed = 'installed',
	Run = 'run',
	More = 'more'
}

export interface Connector {
	readonly provider: any;
	readonly name: string;
	readonly icon: string;
	readonly deepLink?: string;
	readonly walletAddress: string;
	readonly chainType?: ChainType;
	readonly connectorType?: ConnectorType;

	getProvider(): Promise<any>;
	beforeConnecting(): void;
	connectSuccess(address: string): void;
	getWalletAddress(): string;
	resetStatus(): void;

	connect(): Promise<string>;
	disconnect(): Promise<void>;
	reconnection(): Promise<void>;

	on<T>(eventName: EventName, callback: (data: T) => void): void;
	once<T>(eventName: EventName, callback: (data: T) => void): void;
	off<T>(eventName: EventName, callback: (data: T) => void): void;

	signMessage?(message: string): Promise<string>;
	signTransaction?(transaction: any): Promise<string>;
	sendTransaction?(transaction: any): Promise<string>;
	waitForTransactionReceipt?(transaction: any): Promise<string>;
	readContract?(contract: any): Promise<string>;
	writeContract?(contract: any): Promise<string>;
	multicall?(requests: any, option: any): Promise<string>;
	multipleRequest?(requests: any): Promise<string>;
	switchNetwork?(chainId: number): Promise<string>;
}

export type ConnectorEventMap = {
	change: {
		accounts?: readonly string[] | undefined;
		chainId?: number | undefined;
	};
	connect: { accounts: readonly string[]; chainId: number };
	disconnect: never;
	error: { error: Error };
	message: { type: string; data?: unknown | undefined };
};

export type ProviderConnectInfo = {
	chainId: string;
};

export type ProviderMessage = {
	type: string;
	data: unknown;
};

export type EIP1193EventMap = {
	accountsChanged(accounts: string[]): void;
	chainChanged(chainId: string): void;
	connect(connectInfo: ProviderConnectInfo): void;
	disconnect(error: ProviderRpcError): void;
	message(message: ProviderMessage): void;
};

export type EIP1193Events = {
	on<event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]): void;
	removeListener<event extends keyof EIP1193EventMap>(event: event, listener: EIP1193EventMap[event]): void;
};

export enum ConnectStatus {
	Disconnected = 'disconnected',
	Connected = 'connected',
	Error = 'error'
}

export interface IContractOptions {
	abi: any;
	address: string;
	functionName: string;
	args?: any[];
	value?: bigint | undefined | any;
	options?: any;
	rpcUrl?: string;
	from?: string;
}

export interface ITransactionOptions {
	from: string;
	to: string;
	data: string;
	value?: string;
}
