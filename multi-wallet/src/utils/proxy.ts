import type { Connector } from '@type/connector';

export const PROXY_METHODS = [
	'disconnect',
	'signMessage',
	'signTransaction',
	'sendTransaction',
	'waitForTransactionReceipt',
	'readContract',
	'switchNetwork',
	'writeContract',
	'multicall',
	'multipleRequest'
] as const;

export const createConnectorProxy = (connector: Connector | null) => {
	return new Proxy(connector || ({} as Record<string, any>), {
		get(target, prop: string) {
			if (!PROXY_METHODS.includes(prop as any)) {
				return (target as Record<string, any>)[prop];
			}

			return async (...args: unknown[]) => {
				if (!connector) {
					throw new Error('No wallet connected');
				}

				if (!(prop in connector)) {
					// console.log('connector', connector);
					throw new Error(`Method ${prop} not supported by current wallet`);
				}

				try {
					return await (connector as Record<string, any>)[prop](...args);
				} catch (error: any) {
					// console.log(error);
					throw new Error(`Failed to execute ${prop}: ${error.message}`);
				}
			};
		}
	});
};
