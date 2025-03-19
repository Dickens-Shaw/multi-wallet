'use client';
import { useWalletKit } from '@hooks/useWalletKit';
import { formatAddress } from '@utils/formatter';
import { useContext, useEffect, useState } from 'react';
import WalletInfoInfoWrap from './style';
import type { NetworkInfo } from '@type/net';
import Dropdown from '@components/Dropdown';
import { ChainContext } from '../WalletKitProvider/ChainProvider';

export function ConnectedInfo({ avatar, walletAddress, onClick, className }: any) {
	const { currentNetwork, getSupportNets, currentChainType, switchNetwork } = useWalletKit();
	const { showNetwork } = useContext(ChainContext);

	const [supportNets, setSupportNets] = useState<NetworkInfo[]>([]);

	useEffect(() => {
		console.log('ConnectButton', getSupportNets());
		setSupportNets(getSupportNets());
	}, [currentChainType]);

	return (
		<WalletInfoInfoWrap className={className}>
			{showNetwork && (
				<Dropdown
					value={currentNetwork?.chainId}
					options={supportNets.map(net => ({ value: net.chainId, label: net.nativeCurrency.symbol || net.chainName }))}
					onChange={switchNetwork}
					renderOptionItem={(option, isSelected) => {
						return (
							<div>
								{option.label}
								{isSelected && <span>✔</span>}
							</div>
						);
					}}
				/>
			)}

			<button onClick={() => onClick()}>
				{avatar?.text}
				<span>{formatAddress(walletAddress)}</span>
			</button>
		</WalletInfoInfoWrap>
	);
}
