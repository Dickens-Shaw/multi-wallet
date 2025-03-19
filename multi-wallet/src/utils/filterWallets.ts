import { ChainType } from '@web3jskit/type';
import SupportWallets from '@config/walletConfig';

export function filterWallets(chainType: ChainType): any[] {
	return SupportWallets.filter(wallet => wallet.supportedChains.includes(chainType));
}
