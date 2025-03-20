import { ChainType } from '@type/chain';
import SupportWallets from '@config/walletConfig';

export function filterWallets(chainType: ChainType): any[] {
	return SupportWallets.filter(wallet => wallet.supportedChains.includes(chainType));
}
