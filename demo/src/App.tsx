import { ChainType, SupportWallet, WalletKitProvider, useWalletKit } from 'multi-wallet';
import Demo from './Demo';
import './App.css'

export default function App() {
	const { theme, language } = useWalletKit();
	return (
		<WalletKitProvider
			language={language}
			theme={theme}
			defaultChainType={ChainType.EVM}
			defaultChainId={1}
			supportWallets={[SupportWallet.METAMASK, SupportWallet.PHANTOM]}
			customEvmNetworks={[]}
			showNetwork
		>
			<Demo />
		</WalletKitProvider>
	)
} 