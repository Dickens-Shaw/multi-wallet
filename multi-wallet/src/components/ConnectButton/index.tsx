'use client';
import { useTranslation } from 'react-i18next';
import { useWalletKit } from '@hooks/useWalletKit';
import { ConnectedInfo } from './ConnectedInfo';
interface ConnectButtonProps {
	text?: string;
	showAvatar?: boolean;
	className?: string;
	infoClass?: string;
}

export function ConnectButton(props: ConnectButtonProps) {
	const { t } = useTranslation();

	const { text = t('connectWallet'), showAvatar = true, className, infoClass } = props;
	const { avatar, connectStatus, walletAddress, connect, showWalletInfo } = useWalletKit();

	return (
		<div>
			{connectStatus === 'connected' ? (
				<ConnectedInfo
					className={infoClass}
					avatar={showAvatar ? avatar : undefined}
					walletAddress={walletAddress}
					onClick={() => {
						showWalletInfo();
					}}
				/>
			) : (
				<button
					className={className}
					onClick={() => {
						connect();
					}}
				>
					{text}
				</button>
			)}
		</div>
	);
}
