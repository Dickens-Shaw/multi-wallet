'use client';
import { type ReactNode } from 'react';
import { ChainProvider } from './ChainProvider';
import { ConnectModal } from '../Modal/ConnectModal';
import { I18nProvider } from './I18nProvider';
import type { Locals, Theme } from '@type/configType';
import { WalletKitThemeProvider } from './ThemeProvider';
import { ThemedGlobalStyle } from '../../theme';
import { WalletInfoModal } from '../Modal/WalletInfoModal';
import { ChainType, type SupportWallet, type NetworkInfo } from '@web3jskit/wallethelper';

interface IWalletKitProvider {
	children: ReactNode;
	language?: Locals;
	defaultChainType?: ChainType;
	defaultChainId?: number;
	reconnect?: boolean;
	theme?: Theme;
	supportWallets?: SupportWallet[];
	customEvmNetworks?: NetworkInfo[];
	isTokenUp?: boolean;
	showNetwork?: boolean;
}

const WalletKitProvider = ({
	children,
	language,
	defaultChainType = ChainType.EVM,
	defaultChainId = 1,
	reconnect = true,
	theme,
	supportWallets,
	customEvmNetworks,
	isTokenUp,
	showNetwork
}: IWalletKitProvider) => {
	// console.log('theme::', theme);
	// console.log('language::', language);
	// console.log('defaultChain::', defaultChain);

	// const modalType = walletKitStore((state: any) => state.modalType);
	return (
		<>
			<ChainProvider
				reconnect={reconnect}
				defaultChainType={defaultChainType}
				defaultChainId={defaultChainId}
				supportWallets={supportWallets}
				customEvmNetworks={customEvmNetworks}
				isTokenUp={isTokenUp}
				showNetwork={showNetwork}
			>
				<I18nProvider language={language}>
					<WalletKitThemeProvider theme={theme}>
						<ThemedGlobalStyle />
						<ConnectModal />
						<WalletInfoModal />
						<div>{children}</div>
					</WalletKitThemeProvider>
				</I18nProvider>
			</ChainProvider>
		</>
	);
}

export default WalletKitProvider;
