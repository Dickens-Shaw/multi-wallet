'use client';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import ModalHeader from '../Header/ModalHeader';
import GetWalletContainer from './style';
import { chromeIcon } from '../../assets/svg/dataBase';
import QRCode from 'react-qr-code';

interface GetWalletProps {
	wallet: any;
	onBack?: () => void;
	onClose: () => void;
}

export function GetWallet({ wallet, onBack, onClose }: GetWalletProps) {
	const { t } = useTranslation();

	const [showQRCode, setShowQRCode] = useState(false);

	return (
		<GetWalletContainer>
			<ModalHeader
				onClose={onClose}
				title={`${t('get')} ${wallet.name}`}
				onBack={() => {
					if (showQRCode) {
						return setShowQRCode(false);
					}
					onBack && onBack();
				}}
			/>
			{showQRCode ? (
				<div className="qrCodeBox">
					<div className="downloadTip">{t('getAppTip')}</div>
					<div className="qrCode">
						<QRCode value={wallet.downloadUrl} />
					</div>
					<div className="button" onClick={() => setShowQRCode(false)}>
						{t('continue')}
					</div>
				</div>
			) : (
				<div className="cardBox">
					<div className="card">
						<img src={chromeIcon} alt="Chrome" />
						<div>
							<div className="title">{`${wallet.name} ${t('forChrome')}`}</div>
							<div className="description">{t('chromeDescription')}</div>
							<div
								className="button"
								onClick={() => {
									window.open(wallet.extension, '_blank');
								}}
							>
								{t('addToChrome')}
							</div>
						</div>
					</div>
					<div className="card">
						<img src={wallet.icon} alt={wallet.name} />
						<div>
							<div className="title">{`${wallet.name} ${t('forMobile')}`}</div>
							<div className="description">{t('mobileDescription')}</div>
							<div className="button" onClick={() => setShowQRCode(true)}>
								{t('getMobileApp')}
							</div>
						</div>
					</div>
				</div>
			)}
		</GetWalletContainer>
	);
}
