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
			defaultChainId={33772211}
			supportWallets={[SupportWallet.METAMASK, SupportWallet.PHANTOM]}
			customEvmNetworks={[
				{
					chainId: 3721,
					chainName: 'Xone Mainnet',
					rpcUrls: ['https://rpc.xone.org'],
					iconUrls: [],
					nativeCurrency: {
						name: 'XOne Coin',
						symbol: 'XOC',
						decimals: 18
					},
					blockExplorerUrls: ['https://xscscan.com']
				}
			]}
			isTokenUp
			showNetwork
		>
			<Demo />
		</WalletKitProvider>
	)
} 