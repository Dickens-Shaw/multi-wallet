'use client';
import { useTranslation } from 'react-i18next';
import ModalHeader from '../Header/ModalHeader';
import SpinSvg from '../SVGs/spinSvg';
import ConnectingContainer from './style';

interface ConnectingProps {
	wallet: any;
	onClose: () => void;
}

export function Connecting({ wallet, onClose }: ConnectingProps) {
	const { t } = useTranslation();

	return (
		<>
			<ModalHeader className="mainTitle" onClose={onClose} />
			<ConnectingContainer>
				<div className="logo">
					<img src={wallet?.icon} alt={wallet?.name} />
				</div>
				<div className="introduce">{`${t('opening')} ${wallet?.name} ${t('title')}...`}</div>
				<div className="detail">{t('confirmConnection')}</div>
				<SpinSvg className="loading" />
			</ConnectingContainer>
		</>
	);
}
