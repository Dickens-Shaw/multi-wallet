import { ChainType } from '@web3jskit/type';
import {
	MetaMaskIcon,
	PhantomIcon,
	TronLinkIcon,
	GelWalletIcon,
	TokenPocketIcon,
	OKXIcon,
	CoinbaseIcon,
	TrustWalletIcon,
	// ArgentIcon,
	BitgetIcon,
	TokenUpIcon
} from './iconDatabase';

export interface WalletConfig {
	name: SupportWallet;
	supportedChains: ChainType[];
	icon: string;
	deepLink?: string;
	extension?: string;
	webUrl?: string;
	downloadUrl?: string;
	userAgent?: string;
	envs?: string[];
}

export enum SupportWallet {
	ARGENT_X = 'Argent_X',
	BITGET_WALLET = 'Bitget_Wallet',
	COINBASE_WALLET = 'Coinbase_Wallet',
	GEL_WALLET = 'Gel_Wallet',
	METAMASK = 'MetaMask',
	OKX_WALLET = 'OKX_Wallet',
	PHANTOM = 'Phantom',
	TOKEN_POCKET = 'TokenPocket',
	TOKENUP = 'TokenUp',
	TRON_LINK = 'TronLink',
	TRUST_WALLET = 'Trust_Wallet'
}

const SupportWallets: WalletConfig[] = [
	// {
	// 	name: SupportWallet.ARGENT_X,
	// 	supportedChains: [ChainType.EVM],
	// 	icon: ArgentIcon,
	// 	deepLink: '',
	// 	extension: 'https://chromewebstore.google.com/detail/argent-x-starknet-wallet/dlcobpjiigpikoobohmabehhmhfoodbb',
	// 	downloadUrl: 'https://www.argent.xyz/download-argent',
	// 	userAgent:
	// 		'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36',
	// 	envs: ['starknet', 'starknet_argentX']
	// },
	{
		name: SupportWallet.BITGET_WALLET,
		supportedChains: [ChainType.EVM, ChainType.SOL],
		icon: BitgetIcon,
		deepLink: 'bitkeep://bkconnect', // https://bkcode.vip
		extension: 'https://chromewebstore.google.com/detail/bitget-wallet-formerly-bi/jiidiaalihmmhddjgbnbgdfflelocpak',
		downloadUrl: 'https://web3.bitget.com/wallet-download',
		userAgent:
			'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Mobile Safari/537.36; BitKeep Android/8.27.0',
		envs: [
			'starknet',
			'starknet_argentX',
			'bitgetWallet',
			'bitgetTonWallet',
			'bitkeep',
			'ethereum.isBitKeep',
			'ethereum.isMetaMask',
			'phantom'
		]
	},
	{
		name: SupportWallet.COINBASE_WALLET,
		supportedChains: [ChainType.EVM],
		icon: CoinbaseIcon,
		deepLink: '',
		extension: 'https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
		downloadUrl: 'https://www.coinbase.com/wallet/downloads',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36',
		envs: ['ethereum.isCoinbaseWallet', 'ethereum.isCoinbaseBrowser']
	},
	{
		name: SupportWallet.GEL_WALLET,
		supportedChains: [ChainType.EVM, ChainType.SOL, ChainType.PUT],
		icon: GelWalletIcon,
		webUrl: 'https://id.gelwallet.com'
	},
	{
		name: SupportWallet.METAMASK,
		supportedChains: [ChainType.EVM],
		icon: MetaMaskIcon,
		deepLink: 'https://metamask.app.link/dapp',
		extension: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
		downloadUrl: 'https://metamask.io/download',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 WebView MetaMaskMobile',
		envs: ['ethereum.isMetaMask']
	},
	{
		name: SupportWallet.OKX_WALLET,
		supportedChains: [ChainType.EVM, ChainType.SOL, ChainType.Tron],
		icon: OKXIcon,
		deepLink: 'okx://wallet/dapp/details',
		extension: 'https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge',
		downloadUrl: 'https://www.okx.com/download',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 OKEx-google/6.100.0 (23127PN0CC; U; Android 15; zh-CN;) locale=zh-CN statusBarHeight/116 OKApp/(OKEx/6.100.0) brokerDomain/www.okx.com brokerId/0 jsbridge/1.1.0 theme/light',
		envs: ['starknet', 'starknet_argentX', 'ethereum.isMetaMask', 'tronLink', 'okexchain', 'okxwallet']
	},
	{
		name: SupportWallet.PHANTOM,
		supportedChains: [ChainType.EVM, ChainType.SOL, ChainType.BTC],
		icon: PhantomIcon,
		deepLink: 'https://phantom.app/ul/browse',
		extension: 'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
		downloadUrl: 'https://phantom.com/download',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 Phantom/android/24.30.0.29755',
		envs: ['ethereum.isMetaMask', 'phantom']
	},
	{
		name: SupportWallet.TOKEN_POCKET,
		supportedChains: [ChainType.EVM],
		icon: TokenPocketIcon,
		deepLink: 'tpdapp://open',
		extension: 'https://chromewebstore.google.com/detail/mfgccjchihfkkindfppnaooecgfneiii',
		downloadUrl: 'https://www.tokenpocket.pro/en/download/app',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36 TokenPocket_Android',
		envs: ['ethereum.isMetaMask', 'tokenPocket', 'ethereum.isTokenPocket']
	},
	{
		name: SupportWallet.TOKENUP,
		supportedChains: [ChainType.EVM, ChainType.SOL],
		icon: TokenUpIcon,
		webUrl: 'https://web.tokenup.org'
	},
	{
		name: SupportWallet.TRON_LINK,
		supportedChains: [ChainType.Tron],
		icon: TronLinkIcon,
		deepLink: 'tronlinkoutside://pull.activity',
		extension: 'https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
		downloadUrl: 'https://www.tronlink.org/dlDetails',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36',
		envs: ['tronLink']
	},
	{
		name: SupportWallet.TRUST_WALLET,
		supportedChains: [ChainType.EVM],
		icon: TrustWalletIcon,
		deepLink: 'https://link.trustwallet.com/open_url',
		extension: 'https://chromewebstore.google.com/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
		downloadUrl: 'https://trustwallet.com/download',
		userAgent:
			'Mozilla/5.0 (Linux; Android 15; 23127PN0CC Build/AQ3A.240627.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/131.0.6778.135 Mobile Safari/537.36',
		envs: ['trustwallet', 'trustWallet', 'ethereum.isTrust', 'ethereum.isTrustWallet']
	}
	// add more wallets
];

export default SupportWallets;
