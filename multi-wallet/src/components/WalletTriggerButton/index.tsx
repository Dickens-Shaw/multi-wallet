'use client';
import React, { useMemo } from 'react';
import Text from '../Text';
import { FlexBox } from '../../styled';
import Icon from '../Icon';
import WalletItem from './style';
import { useWalletKit } from '@hooks/useWalletKit';
import { ConnectorType } from '@web3jskit/wallethelper';

export interface IWalletTriggerButton {
	connector: any;
	onConnect: (address: string) => void;
	onGetWallet?: () => void;
	onError?: (error: any) => void;
}

export const WalletTriggerButton: React.FC<IWalletTriggerButton> = ({ connector, onConnect, onGetWallet, onError }) => {
	const { connectStatus, currentChainType, currentConnector, isConnecting } = useWalletKit();
	const disabled = useMemo(() => {
		return currentConnector?.chainType === currentChainType && connectStatus === 'connected';
	}, [connectStatus, currentConnector, currentChainType]);
	const handleConnect = async () => {
		try {
			if (connector?.connectorType === ConnectorType.More && !connector?.deepLink) {
				return onGetWallet?.();
			}
			if (disabled) return;

			const address = await connector.connect();
			typeof onConnect === 'function' && onConnect(address);
		} catch (error) {
			onError?.(error);
		}
	};
	return (
		<WalletItem
			onClick={handleConnect}
			className={
				disabled ? 'disabled' : typeof isConnecting === 'object' && isConnecting.name === connector.name ? 'active' : ''
			}
		>
			<FlexBox className={'gap-10'}>
				<Icon src={connector.icon || ''} />
				<Text
					text={connector.name?.replaceAll('_', ' ') || ''}
					className={connector.connectorType === ConnectorType.Installed ? 'installed' : ''}
				/>
			</FlexBox>
		</WalletItem>
	);
};
