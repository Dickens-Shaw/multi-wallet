'use client';
import Modal from './index';
import { useTranslation } from 'react-i18next';
import ModalHeader from '../Header/ModalHeader';
import { useWalletKit } from '@hooks/useWalletKit';
import { formatAddress } from '@utils/formatter';
import { InfoModalContainer } from './style';
import CopySvg from '../SVGs/copySvg';
import CopiedSvg from '../SVGs/copiedSvg';
import ExitSvg from '../SVGs/exitSvg';
import copyToClipboard from 'copy-to-clipboard';
import { useEffect, useState } from 'react';
import { generateRandomAvatar } from '@utils/generateAvatar';
import { useModalStore } from '@stores/modalStore';

export function WalletInfoModal() {
	const { t } = useTranslation();
	const { walletAddress, avatar, setAvatar, currentConnector } = useWalletKit();

	const [copied, setCopied] = useState(false);
	const { closeWalletInfoModal, isShowWalletInfoModal } = useModalStore();
	const generateAvatar = () => {
		const newAvatar = generateRandomAvatar();
		setAvatar(newAvatar);
	};

	useEffect(() => {
		generateAvatar();
	}, []);

	const handleCancel = () => {
		closeWalletInfoModal();
	};

	return (
		<Modal isOpen={isShowWalletInfoModal} onCancel={handleCancel}>
			<InfoModalContainer>
				<ModalHeader onClose={handleCancel} />
				<div className="avatarBox" onClick={() => generateAvatar()}>
					<div
						className="avatar"
						style={{
							backgroundColor: avatar?.bg
						}}
					>
						{avatar?.text}
					</div>
				</div>
				<div className="accountInfo">
					<div className="address">{formatAddress(walletAddress)}</div>
					{/* <div className="tokenAmount">{'0 ETH'}</div> */}
				</div>
				<div className="btnGroup">
					<div
						className="button"
						onClick={() => {
							copyToClipboard(walletAddress);
							if (copied) return;
							setCopied(true);
							setTimeout(() => {
								setCopied(false);
							}, 1000);
						}}
					>
						<div className="btnIcon">{copied ? <CopiedSvg /> : <CopySvg />}</div>
						<div className="btnText">{t(copied ? 'copied' : 'copyAddress')}</div>
					</div>
					<div
						className="button"
						onClick={() => {
							currentConnector?.disconnect();
							closeWalletInfoModal();
						}}
					>
						<div className="btnIcon">
							<ExitSvg />
						</div>
						<div className="btnText">{t('disConnect')}</div>
					</div>
				</div>
			</InfoModalContainer>
		</Modal>
	);
}
