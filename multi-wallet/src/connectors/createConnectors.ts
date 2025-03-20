import { ChainType } from '@type/chain';
import supportWallets, { SupportWallet } from '@config/walletConfig';
import { checkIsMobile, detectWalletBrowser } from '@utils/util';
import { ConnectorType } from '../types/connector';

declare global {
	interface Window {
		solana: any;
		tronLink: any;
		tronWeb: any;
		tron: any;
		ethereum: any;
		walletProvider: any;
	}
}

const modules = {
	Bitget_Wallet_DeepLink: () => import(`./Bitget_Wallet/deepLinkConnector`),
	Bitget_Wallet_Solana: () => import(`./Bitget_Wallet/solConnector`),
	Gel_Wallet_Ethereum: () => import(`./Gel_Wallet/evmConnector`),
	Gel_Wallet_PUT: () => import(`./Gel_Wallet/putConnector`),
	Gel_Wallet_Solana: () => import(`./Gel_Wallet/solConnector`),
	MetaMask_DeepLink: () => import(`./MetaMask/deepLinkConnector`),
	OKX_Wallet_Solana: () => import(`./OKX_Wallet/solConnector`),
	OKX_Wallet_Tron: () => import(`./OKX_Wallet/tronConnector`),
	OKX_Wallet_DeepLink: () => import(`./OKX_Wallet/deepLinkConnector`),
	Phantom_Bitcoin: () => import(`./Phantom/btcConnector`),
	Phantom_DeepLink: () => import(`./Phantom/deepLinkConnector`),
	Phantom_Solana: () => import(`./Phantom/solConnector`),
	TokenPocket_DeepLink: () => import(`./TokenPocket/deepLinkConnector`),
	TronLink_Tron: () => import(`./TronLink/tronConnector`),
	TronLink_DeepLink: () => import(`./TronLink/deepLinkConnector`),
	Trust_Wallet_DeepLink: () => import(`./Trust_Wallet/deepLinkConnector`)
} as any;

export async function createConnector(
	chainType: ChainType,
	supportList: SupportWallet[],
	isTokenUp?: boolean
): Promise<any[]> {
	// TODO: supportList
	console.log('WalletHelper---createConnector', chainType, supportList, isTokenUp);
	const runTypeWallet = isTokenUp ? SupportWallet.TOKENUP : SupportWallet.GEL_WALLET;

	// gelWalletConnectors(run)
	const RunTypeWallet = supportWallets.find(wallet => wallet.name === runTypeWallet);
	const isRunTypeWalletSupported = RunTypeWallet?.supportedChains.includes(chainType);
	// console.log('isRunTypeWalletSupported', isRunTypeWalletSupported);
	let runTypeWalletConnectors: any[] = [];
	if (isRunTypeWalletSupported) {
		const runTypeWalletFile: any = await modules[`Gel_Wallet_${chainType}`]();
		runTypeWalletConnectors = [new runTypeWalletFile.default(RunTypeWallet)];
	}

	if (checkIsMobile() && !detectWalletBrowser()) {
		const deepLinkConnectors = await Promise.all(
			supportWallets
				.filter(wallet => wallet.deepLink)
				.map(async wallet => {
					const connectorFile = await modules[`${wallet.name}_DeepLink`]();
					return new connectorFile['default'](wallet);
				})
		);
		const concatList = [...deepLinkConnectors, ...runTypeWalletConnectors];
		console.log('deepLinkConnectors---', concatList);
		return concatList;
	}

	// evmConnectors(installed)
	if (chainType === ChainType.EVM) {
		const { createConnectors: createEvmConnectors } = await import('./_evm/createConnectors');
		const evmConnectors = await createEvmConnectors();
		const evmConnectorsNames = evmConnectors.map(connector => connector.name.replace(' ', '_')).concat(runTypeWallet);
		const restEvmConnectors = supportWallets
			.filter(
				wallet =>
					wallet.supportedChains.includes(chainType) &&
					![...evmConnectorsNames, SupportWallet.GEL_WALLET, SupportWallet.TOKENUP].includes(wallet.name)
			)
			.map(wallet => {
				return {
					...wallet,
					connectorType: ConnectorType.More
				};
			});
		const isRunTypeExist = evmConnectors.find(connector => connector.name === runTypeWallet);
		const concatList = [...evmConnectors, ...(isRunTypeExist ? [] : runTypeWalletConnectors), ...restEvmConnectors];
		console.log('evmConnectors---', concatList);
		return concatList;
	}

	// commonConnectors(more)
	const commonConnectors = await Promise.all(
		supportWallets
			.filter(
				wallet =>
					wallet.supportedChains.includes(chainType) &&
					![SupportWallet.GEL_WALLET, SupportWallet.TOKENUP].includes(wallet.name)
			)
			.map(async wallet => {
				// console.log('commonConnectors---', wallet);
				const folderName = wallet.name === SupportWallet.TOKENUP ? SupportWallet.GEL_WALLET : wallet.name;
				const connectorFile = await modules[`${folderName}_${chainType}`]();
				return new connectorFile['default'](wallet);
			})
	);
	const isRunTypeExist = commonConnectors.find(connector => connector.name === runTypeWallet);
	const concatList = [...commonConnectors, ...(isRunTypeExist ? [] : runTypeWalletConnectors)];
	console.log('commonConnectors---', concatList);
	return concatList;
}
