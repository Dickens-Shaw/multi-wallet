import { type QueryKey } from '@tanstack/query-core';
import { SupportWallet } from '@config/walletConfig';

export function hashFn(queryKey: QueryKey): string {
	return JSON.stringify(queryKey, (_, value: any) => {
		if (isPlainObject(value))
			return Object.keys(value)
				.sort()
				.reduce((result: any, key) => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					result[key] = value[key];
					return result;
				}, {} as any);
		if (typeof value === 'bigint') return value.toString();
		return value;
	});
}

// biome-ignore lint/complexity/noBannedTypes:
function isPlainObject(value: any): value is object {
	if (!hasObjectPrototype(value)) {
		return false;
	}

	// If has modified constructor
	const ctor = value.constructor;
	if (typeof ctor === 'undefined') return true;

	// If has modified prototype
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;

	// If constructor does not have an Object-specific method
	// biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
	if (!Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf')) return false;

	// Most likely a plain Object
	return true;
}

function hasObjectPrototype(o: any): boolean {
	return Object.prototype.toString.call(o) === '[object Object]';
}

export function utf8ToHex(s: string) {
	const utf8encoder = new TextEncoder();
	const rb = utf8encoder.encode(s);
	let r = '';
	for (const b of rb) {
		r += ('0' + b.toString(16)).slice(-2);
	}
	return '0x' + r;
}

export const checkIsMobile = () => {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

interface WalletInfo {
	type: SupportWallet | null;
	provider: any;
}

export function detectWalletBrowser(): WalletInfo | null {
	// if (typeof window === 'undefined' || !checkIsMobile()) return null;
	const ua = navigator.userAgent;
	const win = window as any;

	// Check via userAgent
	if (ua.includes('BitKeep')) {
		return {
			type: SupportWallet.BITGET_WALLET,
			provider: win.bitgetWallet || win.bitkeep
		};
	}
	if (ua.includes('MetaMaskMobile')) {
		return {
			type: SupportWallet.METAMASK,
			provider: win.ethereum
		};
	}
	if (ua.includes('OKEx') || ua.includes('OKApp')) {
		return {
			type: SupportWallet.OKX_WALLET,
			provider: win.okxwallet
		};
	}
	if (ua.includes('Phantom')) {
		return {
			type: SupportWallet.PHANTOM,
			provider: win.phantom
		};
	}
	if (ua.includes('TokenPocket')) {
		return {
			type: SupportWallet.TOKEN_POCKET,
			provider: win.tokenPocket || win.ethereum
		};
	}

	// Check via envs
	if (win.starknet_argentX) {
		return {
			type: SupportWallet.ARGENT_X,
			provider: win.starknet_argentX
		};
	}
	if (win.bitgetWallet || win.bitkeep) {
		return {
			type: SupportWallet.BITGET_WALLET,
			provider: win.bitgetWallet || win.bitkeep
		};
	}
	if (win.ethereum?.isCoinbaseWallet || win.ethereum?.isCoinbaseBrowser) {
		return {
			type: SupportWallet.COINBASE_WALLET,
			provider: win.ethereum
		};
	}
	if (win.okxwallet) {
		return {
			type: SupportWallet.OKX_WALLET,
			provider: win.okxwallet
		};
	}
	if (win.phantom) {
		return {
			type: SupportWallet.PHANTOM,
			provider: win.phantom
		};
	}
	if (win.tokenPocket || win.ethereum?.isTokenPocket) {
		return {
			type: SupportWallet.TOKEN_POCKET,
			provider: win.tokenPocket || win.ethereum
		};
	}
	if (win.tronLink) {
		return {
			type: SupportWallet.TRON_LINK,
			provider: win.tronLink
		};
	}
	if (win.trustwallet || win.ethereum?.isTrust || win.ethereum?.isTrustWallet) {
		return {
			type: SupportWallet.TRUST_WALLET,
			provider: win.trustwallet || win.ethereum
		};
	}

	// MetaMask is checked last because other wallets may also inject isMetaMask
	if (win.ethereum?.isMetaMask && !win.phantom && !win.tokenPocket && !win.okxwallet) {
		return {
			type: SupportWallet.METAMASK,
			provider: win.ethereum
		};
	}

	return null;
}
